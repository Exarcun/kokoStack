import os
import shutil
import fnmatch
import hashlib

def get_file_hash(file_path):
    """Calculate the MD5 hash of a file."""
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def copy_project_files(source_dir, destination_dir):
    # Create the destination directory if it doesn't exist
    os.makedirs(destination_dir, exist_ok=True)

    # Files and directories to exclude
    exclude_patterns = [
        'node_modules',
        'package-lock.json',
        'yarn.lock',
        '.git',
        '*.pyc',
        '__pycache__',
        '.DS_Store',
        '.env',
        '.anima',
        '.expo',
        '.history',
        '.idea',
        '.gitignore',
        '2cloud3.py',
        'kokodb.dump',
        'package.json',
        '*.png',
        '*.svg',
        '*.jpeg',
        '*.jpg',
        '*.gif'
        'components',
        'constants',
        'hooks',
        'kokoStack',
        'scripts',
        'assets'
    ]

    # Dictionary to store file hashes
    file_hashes = {}

    for root, dirs, files in os.walk(source_dir):
        # Remove excluded directories from the dirs list
        dirs[:] = [d for d in dirs if not any(fnmatch.fnmatch(d, pattern) for pattern in exclude_patterns)]

        for file in files:
            # Check if the file should be excluded
            if any(fnmatch.fnmatch(file, pattern) for pattern in exclude_patterns):
                continue

            source_path = os.path.join(root, file)
            file_hash = get_file_hash(source_path)

            # Check if we've already copied this file (by content)
            if file_hash in file_hashes:
                print(f"Skipped duplicate: {file}")
                continue

            destination_path = os.path.join(destination_dir, file)

            # If a file with the same name already exists, add a number to make it unique
            counter = 1
            while os.path.exists(destination_path):
                name, ext = os.path.splitext(file)
                destination_path = os.path.join(destination_dir, f"{name}_{counter}{ext}")
                counter += 1

            # Copy the file
            shutil.copy2(source_path, destination_path)
            file_hashes[file_hash] = destination_path
            print(f"Copied: {file}")

if __name__ == "__main__":
    source_directory = "."  # Current directory
    destination_directory = "./project_files"  # New folder for copied files

    copy_project_files(source_directory, destination_directory)
    print(f"All relevant files have been copied to {destination_directory}")