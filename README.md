# The Money App

A book keeping app in rails

# Notes

# Javascript Code Organization

* This app uses angularjs at the front end
* Code is organized in this format

1. jquery, bootstrap javascript and angular libraries are loaded first
2. /assets/global.js is loaded (for non-angularjs code, eg; initialization for every single page)
3. /assets/main.js is loaded (for angularjs code)
4. all are loaded in alphabetical order, and are not meant to contain non-angularjs code!