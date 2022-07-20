# dir-timestamp

A simple utility to recursively set the mtime on trees of directories to the latest mtime of any of the files in them. For use by weird anal people before archiving a bunch of files and distributing them.

# Usage

```
dir-timestamp.js <directory>...
```

Pass the paths to one or more directories. Each one will recursively have all of its subdirectories' mtimes updated.

Finding something that is neither a file or a directory will cause that top-level directory to be aborted. Finding an empty subdirectory will also cause that top-level directory to be aborted.

Aborting one top-level directory will not prevent other top-level directories from being processed.

## License

[MIT](LICENSE)
