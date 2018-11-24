const arrayOfBlob = new Array<Blob>();
const encoding = "utf-8";
const file = new File(arrayOfBlob, "/script.txt");
const reader = new FileReader();

reader.onload = function(e) {
  var text = reader.result;
};

reader.readAsText(file, encoding);
