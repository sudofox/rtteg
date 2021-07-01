#!/bin/bash

# sudofox/hatena-app-archive
# reorganize APKs based on package name, versionCode and versionName

APKS=$(find -type f -name \*.apk)

for app in $APKS; do

    # package: name='com.package.name' versionCode='10' versionName='1.2' platformBuildVersionName='5.0.1-1624448'
    details=$(aapt dump badging $app | grep "^package: ")

    # com.package.name
    package_name=$(echo "$details" | grep -Po " name='\K.+?(?=')")
    # 10
    version_code=$(echo "$details" | grep -Po " versionCode='\K.+?(?=')")
    # version 1.2
    version_name=$(echo "$details" | grep -Po " versionName='\K.+?(?=')")

    # if the app folder doesn't exist; create it

    if [ ! -d ./$package_name ]; then
        echo "Creating ./$package_name"
        mkdir -p ./$package_name
    fi

    # assemble the new filename

    new_filename="$package_name-$version_code-$version_name.apk"
    echo mv $app ./$package_name/$new_filename
    mv $app ./$package_name/$new_filename
done
