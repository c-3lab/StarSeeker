from glob import glob
from os.path import basename
from os.path import splitext

from setuptools import setup
from setuptools import find_packages

setup(
    name='ss_conductor',
    version='0.1.0',
    license='MIT LICENSE',
    description='StartSeeker utilities',
    author='mkyutani@gmail.com',
    url='http://github.com/c-3lab/StartSeeker/StarSeeker/operator',
    packages=find_packages(),
    install_requires=open('requirements.txt').read().splitlines(),
    entry_points={
        'console_scripts': [
            'ss_conductor=ss_util.ss_conductor:main',
        ]
    },
    zip_safe=False
)
