touch ./build/pony.min.js
minifyjs -m -l 3 -i src/core.js > ./build/pony.min.js
minifyjs -m -l 3 -i src/shedrow.js >> ./build/pony.min.js
minifyjs -m -l 3 -i src/include.js >> ./build/pony.min.js
minifyjs -m -l 3 -i src/signals.js >> ./build/pony.min.js
minifyjs -m -l 3 -i src/mixin.js >> ./build/pony.min.js
minifyjs -m -l 3 -i src/rpc.js >> ./build/pony.min.js