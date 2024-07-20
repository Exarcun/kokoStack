import os
import shutil
import fnmatch

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
        '.env'
    ]

    for root, dirs, files in os.walk(source_dir):
        # Remove excluded directories from the dirs list
        dirs[:] = [d for d in dirs if not any(fnmatch.fnmatch(d, pattern) for pattern in exclude_patterns)]

        for file in files:
            # Check if the file should be excluded
            if any(fnmatch.fnmatch(file, pattern) for pattern in exclude_patterns):
                continue

            source_path = os.path.join(root, file)
            
            # Generate a unique filename to avoid conflicts
            base, extension = os.path.splitext(file)
            relative_path = os.path.relpath(root, source_dir)
            unique_filename = f"{base}_{relative_path.replace(os.path.sep, '_')}{extension}"
            destination_path = os.path.join(destination_dir, unique_filename)

            # Copy the file
            shutil.copy2(source_path, destination_path)
            print(f"Copied: {file} -> {unique_filename}")

if __name__ == "__main__":
    source_directory = "."  # Current directory
    destination_directory = "./all_project_files"  # New folder for copied files

    copy_project_files(source_directory, destination_directory)
    print(f"All relevant files have been copied to {destination_directory}")