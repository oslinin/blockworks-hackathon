#!/bin/bash

# Directories to include
INCLUDE_DIRS="apis profitability_checks"

# Directories to exclude
EXCLUDE_DIRS="node_modules|.git|docs|src"

# Generate folder structure
echo "Project Structure:"
tree $INCLUDE_DIRS -I "$EXCLUDE_DIRS"

# List functions in each JavaScript file and their calls
echo -e "\nFunctions and Their Calls in JavaScript Files:"

find $INCLUDE_DIRS -name '*.js' | while read file; do
  echo "$file"
  grep -E 'function |const |let |var ' "$file" | sed 's/^/    /'
  grep -E 'await |\.then\(' "$file" | sed 's/^/        /'
done