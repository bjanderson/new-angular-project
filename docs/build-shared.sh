#!/bin/bash

cd ./shared
rm -rf dist
npm rm -g @bjanderson/project-name-shared
npm run build
npm link

cd ../server
npm rm @bjanderson/project-name-shared
npm link @bjanderson/project-name-shared


cd ../ui
rm -rf .angular/
npm rm @bjanderson/project-name-shared
npm link @bjanderson/project-name-shared
