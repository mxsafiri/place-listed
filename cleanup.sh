#!/bin/bash

# Backup the original files
echo "Creating backup of original files..."
mkdir -p /Users/aux.wav/CascadeProjects/place-listed/backup
cp -r /Users/aux.wav/CascadeProjects/place-listed/src/components /Users/aux.wav/CascadeProjects/place-listed/backup/
cp -r /Users/aux.wav/CascadeProjects/place-listed/src/contexts /Users/aux.wav/CascadeProjects/place-listed/backup/
cp -r /Users/aux.wav/CascadeProjects/place-listed/src/lib /Users/aux.wav/CascadeProjects/place-listed/backup/
cp -r /Users/aux.wav/CascadeProjects/place-listed/src/styles /Users/aux.wav/CascadeProjects/place-listed/backup/

# Remove the old directories
echo "Removing old directories..."
rm -rf /Users/aux.wav/CascadeProjects/place-listed/src/components
rm -rf /Users/aux.wav/CascadeProjects/place-listed/src/contexts
rm -rf /Users/aux.wav/CascadeProjects/place-listed/src/lib
rm -rf /Users/aux.wav/CascadeProjects/place-listed/src/styles

echo "Cleanup completed successfully!"
