### Creation steps
 - npm install -g react-native-cli
 - react-native init safETag
### Instalation steps
 - npm install
 - open project into Android Studio (safETag/android)
 - npm start (in one cmd)
 - react-native run-android (in another cmd)

###  Build android apk
 - cd android && ./gradlew assembleRelease

### Debug android device on usb
 - go into android studio, open terminal and type "adb shell input keyevent 82"

 ### 3th party lib
 - react-native-paper
 - react-native-vector-icons
 - redux-saga
 - react-redux
 - immutable
 - redux-actions
 - @react-native-community/async-storage
 - react-native-linear-gradient
 - @react-native-community/slider
 - react-native-image-picker
 - install react-native-websocket
 - @react-native-community/netinfo
 - npm install react-native-splash-screen --save


 ## Helper
 1) Unable to delete directory C:\xampp\htdocs\safe-tag\react-native\node_modules\react-native-image-picker\android\build\intermediates\javac\debug\classes\com\
    solve with:
    First, Go to android folder
-    cd android
    Now clean the project...
-    gradlew clean //for Mac users, change gradlew to ./gradlew
    Now run the build process again in the root folder
-    cd..
-    react-native run-android

2) Check compileSdkVersion in build.grandle the same as one in Android\Sdk\platforms
