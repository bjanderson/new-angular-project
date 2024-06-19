#!/bin/bash

cd ./shared
rm -rf dist
npm rm -g @bjanderson/my-project-shared
npm run build
npm link

cd ../server
npm rm @bjanderson/my-project-shared
npm link @bjanderson/my-project-shared


cd ../ui
rm -rf .angular/
npm rm @bjanderson/my-project-shared
npm link @bjanderson/my-project-shared
