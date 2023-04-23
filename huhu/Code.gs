function doGet() {
    var html = HtmlService.createTemplateFromFile('index').evaluate().setTitle('Test Label');
    var htmlOutput = HtmlService.createHtmlOutput(html).addMetaTag('viewport', 'width=device-width, initial-scale=1');
    return htmlOutput;
  }
  
  function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  }
  
  var sn = SpreadsheetApp.openById('1Ww0RLp3YmOtuNJl7BuvRKGUgyn5kiKY8W3JC0V2sgVY').getSheetByName('data1');
  
  function addItem(name, description) {
    var zeroPad = (num, places) => String(num).padStart(places, '0');
    var id = "E" + zeroPad(Math.floor(Math.random() * 500) + 500, 6); //unique id for each entry
    sn.appendRow([id, name, description]);
  }
  
  function getItems() {
    return sn.getDataRange().getValues().slice(1).map(row => ({id: row[0], name: row[1], description: row[2]}));
  }
  
  function deleteItem(id) {
    var values = sn.getDataRange().getValues();
    for (var i = 0; i < values.length; i++) {
      if (values[i][0] == id) {
        sn.deleteRow(i + 1);
        break;
      }
    }
  }
  
  function updateItem(selectedId, editname, editdescription) {
    var values = sn.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (values[i][0] == selectedId) {
        sn.getRange(i + 1, 2).setValue(editname);
        sn.getRange(i + 1, 3).setValue(editdescription);
        break;
      }
    }
  }