#!/bin/bash

#source: https://github.com/paranoida/bash-ios-icons

# --- functions ------------------------------------------------------

function init
{
  mkdir "app_icon"

  DIR="app_icon/splash";
  #DIR="icons";

  SRC_IMAGE="splash-vert.png";
  mkdir $DIR

  #vertical images
  sips -s format png -z 1136 640 $SRC_IMAGE --out $DIR/Default-568h@2x~iphone.png
  sips -s format png -z 1334 750 $SRC_IMAGE --out $DIR/Default-667h.png

  sips -s format png -z 960 640 $SRC_IMAGE --out $DIR/Default@2x~iphone.png

  sips -s format png -z 1024 768 $SRC_IMAGE --out $DIR/Default-Portrait~ipad.png
  sips -s format png -z 480 320 $SRC_IMAGE --out $DIR/Default~iphone.png
  sips -s format png -z 2048 1538 $SRC_IMAGE --out $DIR/Default-Portrait@2x~ipad.png
  sips -s format png -z 2208 1242 $SRC_IMAGE --out $DIR/Default-736h.png

  SRC_IMAGE="splash-horiz.png";
  
  #horizontal images
  sips -s format png -z 768 1024 $SRC_IMAGE --out $DIR/Default-Landscape~ipad.png
  sips -s format png -z 1536 2048 $SRC_IMAGE --out $DIR/Default-Landscape@2x~ipad.png
  sips -s format png -z 1242 2208 $SRC_IMAGE --out $DIR/Default-Landscape-736h.png

  

  cp -v app_icon/splash/*.png platforms/ios/Dashboard/Images.xcassets/LaunchImage.launchimage/
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