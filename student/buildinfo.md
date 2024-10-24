
auf jedem betriebsystem einzeln bauen.

npm run build:mac
npm run build:win
npm run bulid

###### MAC OS ######
macos hat das problem dass es zwei architekturen unterstützen muss x64 und arm64
native libraries wie get-windows lassen sich problemlos für beide plattformen builden "sharp" (imagemanipulation) nicht (wurde daher ersetzt durch reines js)
language tool benötigt eine eigene jre für arm !!!!
alle binaries (auch java) müssen einzeln signiert werden. diese werden daher entpackt, signiert, repacked und am ende wird das gesamt paket nochmal signiert..

xcode mit buildtools und python muss installiert sein


###### WINDOWS ######
visual studio code muss mit c++ buildtools und python 3 am system vorhanden sein
distutils von python muss installiert sein > pip install setuptools  (metapackage)



folgende overrides existieren wegen "get-windows"  (get active window) mit nativen executables 
und "image-js"

npm list signal-exit

next-exam-student@1.0.0
├─┬ default-gateway@7.2.2
│ └─┬ execa@7.2.0
│   └── signal-exit@3.0.7 overridden
├─┬ electron-builder@25.0.5
│ └─┬ app-builder-lib@25.0.5
│   └─┬ @electron/rebuild@3.6.0
│     ├─┬ node-gyp@9.4.1
│     │ └─┬ npmlog@6.0.2
│     │   └─┬ gauge@4.0.4
│     │     └── signal-exit@3.0.7 deduped
│     └─┬ ora@5.4.1
│       └─┬ cli-cursor@3.1.0
│         └─┬ restore-cursor@3.1.0
│           └── signal-exit@3.0.7 deduped
└─┬ get-windows@9.2.0
  ├─┬ @mapbox/node-pre-gyp@1.0.11
  │ └─┬ npmlog@5.0.1
  │   └─┬ gauge@3.0.2
  │     └── signal-exit@3.0.7 deduped
  └─┬ node-gyp@10.2.0
    └─┬ glob@10.4.5
      └─┬ foreground-child@3.3.0
        └── signal-exit@3.0.7 deduped


npm list ml-regression-simple-linear

next-exam-student@1.0.0
└─┬ image-js@0.35.6
  └─┬ ml-regression@5.0.0
    ├─┬ ml-regression-exponential@2.1.3
    │ └── ml-regression-simple-linear@2.0.5 deduped
    ├─┬ ml-regression-power@2.0.0
    │ └── ml-regression-simple-linear@2.0.5 deduped
    └── ml-regression-simple-linear@2.0.5 overridden



next-exam-student@1.0.0
└─┬ image-js@0.35.6
  ├─┬ fast-jpeg@1.0.1
  │ └── tiff@2.1.0
  └── tiff@5.0.3