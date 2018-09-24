var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var exec = require('child_process').spawn;
var os = require('os');
var ifaces = os.networkInterfaces();

function getEthernetInterfaces() {
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1)
        return;
      }

      if (alias >= 1) {
        //this single interface has multiple ipv4 addresses
        console.log("SERVER: " + ifname + ':' + alias, iface.address);
      } else {
        //this interface has only one ipv4 adress
        console.log("SERVER: " + ifname, iface.address);
      }
      ++alias;
    });
  });
}

//server
getEthernetInterfaces();

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    });

    form.on('fileBegin', function (name, file){
      file.path = __dirname + "/" + file.name;
    });

    form.on('file', function (name, file){
      console.log('Uploaded ' + file.name);

      res.write('File uploaded');
      res.end();
    });
  }

}).listen(8087);