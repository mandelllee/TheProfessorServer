#!/bin/bash

#source: https://github.com/paranoida/bash-ios-icons

# --- functions ------------------------------------------------------

function init
{
  mkdir "app_icon"
  DIR="app_icon/icon";
  #DIR="icons";

  mkdir $DIR

  # iTunes
  sips -s format png -z 1024 1024 $FILE --out $DIR/iTunesArtwork@2x.png
  sips -s format png -z 512 512 $FILE --out $DIR/iTunesArtwork.png

  # devices
  sips -s format png -z 144 144 $FILE --out $DIR/icon-72@2x.png
  sips -s format png -z 72 72 $FILE --out $DIR/icon-72.png


  sips -s format png -z 40 40 $FILE --out $DIR/icon-40.png
  sips -s format png -z 80 80 $FILE --out $DIR/icon-40@2x.png


  sips -s format png -z 50 50 $FILE --out $DIR/icon-50.png
  sips -s format png -z 100 100 $FILE --out $DIR/icon-50@2x.png



  sips -s format png -z 60 60 $FILE --out $DIR/icon-60.png
  sips -s format png -z 120 120 $FILE --out $DIR/icon-60@2x.png

  sips -s format png -z 114 114 $FILE --out $DIR/icon@2x.png
  sips -s format png -z 57 57 $FILE --out $DIR/icon.png

  # others
  sips -s format png -z 100 100 $FILE --out $DIR/icon-Small-50@2x.png
  sips -s format png -z 50 50 $FILE --out $DIR/icon-Small-50.png

  sips -s format png -z 58 58 $FILE --out $DIR/icon-Small@2x.png
  sips -s format png -z 29 29 $FILE --out $DIR/icon-Small.png


  sips -s format png -z 152 152 $FILE --out $DIR/icon-152.png
  sips -s format png -z 120 120 $FILE --out $DIR/icon-120.png
  sips -s format png -z 76 76 $FILE --out $DIR/icon-76.png
  sips -s format png -z 152 152 $FILE --out $DIR/icon-76@2x.png

  cp -v app_icon/icon/*.png platforms/ios/Dashboard/Images.xcassets/AppIcon.appiconset/
}

function file_error
{
  echo "Error: Sorry but the file does not exist!"
}

function hint
{
  echo "This script is used to convert one large iOS App icon (1024x1024) into smaller ones based on iOS Human Interface Guidelines"
  echo ""
  echo " Usages:"
  echo " bash appicons.sh file.png"
  echo ""
}

# --- main -----------------------------------------------------------

FILE=$1

if [ -e "$FILE" ]; then
init
elif [ "$FILE" ]; then
file_error
else
hint
fi