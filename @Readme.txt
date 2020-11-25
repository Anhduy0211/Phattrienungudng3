1. create project:
expo init confusion
cd confusion

2. install libraries:
npm install react-native-elements --save
npm install @react-navigation/native @react-navigation/stack @react-navigation/drawer --save
expo install react-native-gesture-handler react-native-reanimated react-native-screens @react-native-community/masked-view react-native-safe-area-context
npm install redux react-redux redux-thunk redux-logger --save
npm install @react-native-picker/picker --save
expo install react-native-modal-datetime-picker @react-native-community/datetimepicker
npm install date-fns --save

3. start json-server:
json-server --watch db.json --delay 2000 --port 3001 --host 0.0.0.0