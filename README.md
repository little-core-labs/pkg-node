pkg-node
========

> Run a version of Node patched by 'pkg-fetch'.

## Installation

```sh
$ npm install -g pkg-node
```

## Usage

The `pkg-node` command exported by this module has the following
command line usage.

```sh
usage: pkg-node [--list-available]
       pkg-node [--arch <arch>] [--platform <platform>] [-t|--target <target>]
                [--] ...[node options]
```

The `pkg-node` command runs a patched version of `node` made available
through the patches in the [pkg-fetch][pkg-fetch] module. The version,
platform, and architecture can all be specified with the command line
flags. The `pkg-node` command will use the default major version of the
running process if a target version is no specified.

To run the `node10` patch used in [pkg][pkg] to run a `script.js` file:

```sh
$ pkg-node -t10 ./script.js
```

To list the possible versions available:

```sh
$ pkg-node --list-available
> Available versions:
  - 0.12.18
  - 4.9.1
  - 6.17.1
  - 8.16.0
  - 10.15.3
  - 12.2.0

> Available platforms:
  - alpine
  - freebsd
  - linux
  - macos
  - win

> Available architectures:
  - arm64
  - armv6
  - armv7
  - s390x
  - x64
  - x86
```

## License

MIT

[pkg-fetch]: https://github.com/zeit/pkg-fetch
[pkg]: https://github.com/zeit/pkg
