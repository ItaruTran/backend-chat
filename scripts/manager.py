#!/usr/bin/python3
import sys

if sys.version_info < (3, 7):
    print("Must be using Python 3.7 or higher")
    exit(1)

import os
from typing import Dict, List
from argparse import ArgumentParser, RawDescriptionHelpFormatter
from subprocess import check_output, run
import json
from enum import Enum
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from os.path import expanduser
from base64 import b64decode, b64encode

parser = ArgumentParser(
  formatter_class=RawDescriptionHelpFormatter,
  add_help=False,
  description=(
    'Management tools for this project'
  ),
)
subparsers = parser.add_subparsers(
  title="actions",
  description=(
    'enter one of these actions'
  )
)
with open('.docker/profiles.json', 'r') as f:
  profiles: dict = json.load(f)

files = [
  '.docker/docker-compose.base.yml',
  '.docker/docker-compose.full.yml',
]

_SWARMPIT_URL = ''

compose_files = []
for f in files:
  compose_files.append('-f')
  compose_files.append(f)

stack_files = []
for f in files:
  stack_files.append('-c')
  stack_files.append(f)

def _run_cmd(args: List[str], env: Dict[str, str] = {}):
  if os.name != 'nt':
    args = ' '.join(args)

  return run(
    args,
    shell=True, check=True,
    env={
      **os.environ.copy(),
      **env
    },
  )
def _get_cmd(args: List[str], env: Dict[str, str] = {}):
  if os.name != 'nt':
    args = ' '.join(args)

  return check_output(
    args,
    shell=True,
    encoding='utf8',
    env={
      **os.environ.copy(),
      **env
    },
  )

def _get_env(keys: List[str], env_file: str):
  env = {}
  with open(env_file) as f:
    for line in f:
      if line.startswith('#') or not line.strip():
        continue

      key, value = line.strip().split('=', 1)
      if key in keys:
        env[key] = value

  return env

def _get_profile(stage):
  f = ''
  if stage == StageType.local:
    f = '.docker/docker-compose.local.yml'
  elif stage == StageType.development:
    f = '.docker/docker-compose.dev.yml'
  elif stage == StageType.staging:
    f = '.docker/docker-compose.staging.yml'
  elif stage == StageType.production:
    f = '.docker/docker-compose.prod.yml'

  compose_files.append('-f')
  compose_files.append(f)

  stack_files.append('-c')
  stack_files.append(f)

  stage = str(stage)
  profile = profiles.get(stage)
  if profile is None:
    raise Exception('Not support this stage')

  print(f'Using stage: {stage}')

  if profiles.get('_settings') and profiles['_settings'].get('env_keys'):
    profile.update(_get_env(profiles['_settings']['env_keys'], profile['ENV_FILE'].replace('../', '')))

  return stage, profile

# ----------- Deploy -----------
class StageType(str, Enum):
  local = 'local'
  development = 'development'
  staging = 'staging'
  production = 'production'
  def __str__(self) -> str:
    return self.value

deploy_parser = subparsers.add_parser(
  'deploy', parents=[parser],
  formatter_class=RawDescriptionHelpFormatter,
  description=(
    'Deploy service'
  ),
)
deploy_parser.add_argument(
    '-s', "--stage",
    metavar='S', type=StageType, choices=list(StageType),
    help=(
      "target environment"
      " (default: local)"
    ),
)
deploy_parser.add_argument(
    '-b', "--build",
    action='store_true',
    help=(
      "build images of stack"
    ),
)
def deploy_service(
  *_,
  stage:str = StageType.local,
  build: bool = False,
):
  stage, profile = _get_profile(stage)
  context = profile["context"]
  stack_name = profile['name']

  if stage == StageType.staging or stage == StageType.production:
    current_branch = _get_cmd([
      'git',
      'branch',
      '--show-current',
    ]).replace('release/', '').strip()

    if current_branch != stage:
      print(f'You must switch to branch "release/{stage}" before update stack')
      exit(1)

  if build:
    print('🏗  Build images')
    _run_cmd(
      ['docker', 'compose', *compose_files, 'build', '--pull'],
      profile,
    )

    if stage != StageType.local:
      print('🚚 Push images to registry')
      _run_cmd(
        ['docker', 'compose', *compose_files, 'push'],
        profile,
      )

  print(f'🚀 Update stack {stack_name}')

  if stage == StageType.local:
    cmds = [
      'docker', f'--context={context}', 'compose',
      *compose_files,
      '-p', stack_name,
      'up', '-d',
    ]
  elif stage != StageType.production:
    compose_content = _get_cmd([
      'docker', 'compose',
      *compose_files,
      '-p', stack_name,
      'convert',
      '--format', 'json',
    ], profile)

    content = json.loads(compose_content)

    content['version'] = '3.8'

    for data in content['services'].values():
      if data.get('build'):
        del data['build']
      if data.get('env_file'):
        del data['env_file']

      if data.get('networks'):
        networks = [*data['networks'].keys()]
        data['networks'] = networks

      if data.get('depends_on'):
        depends_on = [*data['depends_on'].keys()]
        data['depends_on'] = depends_on

      if data.get('command'):
        if isinstance(data['command'], str):
          data['command'] = data['command'].replace('$', '$$')
        else:
          data['command'] = [c.replace('$', '$$') for c in data['command']]

    with open(expanduser('~/.swarmpit'), 'r') as f:
      token = f.read()

    if content.get('configs'):
      for config in content['configs'].values():
        if config.get('external') == True:
          continue

        with open(config['file'], 'r') as f:
          config_content = f.read()

        should_create_config = False
        try:
          with urlopen(Request(
            f'https://{_SWARMPIT_URL}/api/configs/{config["name"]}',
            method='get',
            headers={
              'authorization': token,
            },
          )) as res:
            data = json.load(res)
            if b64decode(data['data']).decode('utf8') != config_content:
              exit(f'You must update suffix of "{config["name"]}" before deploy (like something-v2 -> something-v3)')
        except HTTPError as e:
          if e.code == 404:
            should_create_config = True
          else:
            exit(e.read().decode('utf8'))

        if should_create_config:
          try:
            with urlopen(Request(
              f'https://{_SWARMPIT_URL}/api/configs',
              method='post',
              headers={
                'authorization': token,
                'content-type': 'application/json',
              },
              data=(json.dumps({
                "configName": config["name"],
                "data": b64encode(config_content.encode('utf8')).decode('ascii'),
              }, ensure_ascii=True)).encode('ascii'),
            )) as res:
              print(f'✅ Config created {config["name"]}')
              print(res.read().decode('utf8'))
          except HTTPError as e:
            exit(e.read().decode('utf8'))

        del config['file']
        config['external'] = True

    content = json.dumps(content)

    try:
      with urlopen(Request(
        f'https://{_SWARMPIT_URL}/api/stacks/{stack_name}',
        method='POST',
        headers={
          'authorization': token,
          'content-type': 'application/json',
        },
        data=json.dumps({
          "name": stack_name,
          "spec": {
            "compose": content,
          }
        }, ensure_ascii=True).encode('ascii'),
      )) as res:
        print('✅ Update complete', res.status)
        print(res.read().decode('utf8'))
    except HTTPError as e:
      print('❌ Update fail', e)
      exit(e.read().decode('utf8'))

    return
  else:
    cmds = [
      'docker', f'--context={context}',
      'stack', 'deploy',
      *stack_files,
      '--prune',
      '--with-registry-auth',
      stack_name,
    ]

  _run_cmd(cmds, profile,)

  print('✅ Update complete')

deploy_parser.set_defaults(
  func=deploy_service,
  **deploy_service.__kwdefaults__
)

status_parser = subparsers.add_parser(
  'status', parents=[parser],
  formatter_class=RawDescriptionHelpFormatter,
  description=(
    'Status services'
  ),
)
status_parser.add_argument(
    '-s', "--stage",
    metavar='S', type=StageType, choices=list(StageType),
    help=(
      "target environment"
      " (default: local)"
    ),
)
def status_service(
  *_,
  stage:str = StageType.local,
):
  stage, profile = _get_profile(stage)
  context = profile["context"]
  stack_name = profile['name']

  if stage == StageType.local:
    cmds = [
      'docker', f'--context={context}',
      'compose',
      *compose_files,
      '-p', stack_name,
      'ps', '-a',
    ]
  else:
    cmds = [
      'docker', f'--context={context}',
      'stack',
      'ps', stack_name,
    ]

  _run_cmd(cmds, profile,)

status_parser.set_defaults(
  func=status_service,
  **status_service.__kwdefaults__
)

def main(argv: List[str]):
  if len(argv) == 1 or argv[1] in ('-h', '--help'):
    parser.print_usage()
    print(f'\n{parser.description}')
    exit(0)

  kwargs = vars(parser.parse_args(argv[1:]))
  func = kwargs.pop('func')
  func(**kwargs)

if __name__ == '__main__':
    main(sys.argv)
