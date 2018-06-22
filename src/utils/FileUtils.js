export const readTextFile = (file, callback) => {
  var reader = new FileReader();
  reader.onload = () => {
    var dataURL = reader.result;
    callback(dataURL)
  };
  reader.readAsText(file);
}