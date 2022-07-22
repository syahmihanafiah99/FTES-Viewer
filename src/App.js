import logo from './logo.svg';
import './App.css';

//external
import React,{ useEffect, useState} from "react";
import dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
import cornerstoneMath from "cornerstone-math";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import Hammer from "hammerjs";
import CornerstoneViewport from "react-cornerstone-viewport";
import { Row, Col, Button } from "reactstrap";
import styled from 'styled-components';



cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstoneTools.init();

cornerstoneTools.init({
  mouseEnabled: true,
  touchEnabled: true,
  globalToolSyncEnabled: false,
  showSVGCursors: false
});
const fontFamily =
  "Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif";

cornerstoneTools.textStyle.setFont(`16px ${fontFamily}`);

// Set the tool width
cornerstoneTools.toolStyle.setToolWidth(2);

// Set color for inactive tools
cornerstoneTools.toolColors.setToolColor("rgb(255, 255, 0)");

//Integrate with django coding

window.onload = function() {
  downloadAndView("http://10.40.1.54/instances/ac387d6b-f6d27580-86652c3e-92699397-9dbafed6/file");
};

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

cornerstoneWADOImageLoader.configure({
  beforeSend: function(xhr) {
      // Add custom headers here (e.g. auth tokens)
      //xhr.setRequestHeader('APIKEY', 'my auth token');
  },
});

var loaded = false;

function loadAndViewImage(imageId) {
  var element = document.getElementById('dicomImage');

  try {
      var start = new Date().getTime();
      cornerstone.loadAndCacheImage(imageId).then(function(image) {
          console.log(image);
          var viewport = cornerstone.getDefaultViewportForImage(element, image);
          cornerstone.displayImage(element, image, viewport);




      }, function(err) {
          throw err;
      });
  }
  catch(err) {
      throw err;
  }
}

function downloadAndView(downloadUrl) {
  let url = downloadUrl || document.getElementById('wadoURL').value;

  // prefix the url with wadouri: so cornerstone can find the image loader
  url = "wadouri:" + url;

  // image enable the dicomImage element and activate a few tools
  loadAndViewImage(url);
}

cornerstone.events.addEventListener('cornerstoneimageloadprogress', function(event) {
  const eventData = event.detail;
  const loadProgress = document.getElementById('loadProgress');
  loadProgress.textContent = `Image Load Progress: ${eventData.percentComplete}%`;
});

function getUrlWithoutFrame() {
  var url = document.getElementById('wadoURL').value;
  var frameIndex = url.indexOf('frame=');
  if(frameIndex !== -1) {
      url = url.substr(0, frameIndex-1);
  }
  return url;
}

var element = document.getElementById('dicomImage');
cornerstone.enable(element);
   
const App = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [imageIds, setImageIds] = useState([]);
  let element;
  const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 15px;
  padding: 2px 30px;
  border-radius: 5px;
  margin: 8px 0px;
  cursor: pointer;
  margin-left:200px;
`;  
//insert dicom image to 
  useEffect(() => {
    element = document.getElementById("dicomImage");
    cornerstone.enable(element);
  });

//function for running the files
  const handleFileChange = (e) => {

    const files = Array.from(e.target.files);
    setUploadedFiles(files);
    const imageIds = files.map((file) => {
      return cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    });
    setImageIds(imageIds);
    const StackScrollMouseWheelTool =
      cornerstoneTools.StackScrollMouseWheelTool;
    const stack = {
      currentImageIdIndex: 0,
      imageIds
    };
    cornerstone.loadImage(imageIds[0]).then((image) => {
      cornerstone.displayImage(element, image);
      cornerstoneTools.addStackStateManager(element, ["stack"]);
      cornerstoneTools.addToolState(element, "stack", stack);
    });
    cornerstoneTools.addTool(StackScrollMouseWheelTool);
    cornerstoneTools.setToolActive("StackScrollMouseWheel", {});
    


  };
  
  return (
    <div>
        <Button onClick={handleFileChange}>
        Upload a DICOM file
      </Button>
      <input type="file" style={{marginLeft: "10px"}} onChange={handleFileChange} multiple />
      <button  onClick={setZoomActive}>Zoom/Pan</button>
      
      {/* <button onClick={setMouseWheelActive} style={{ marginLeft: "10px" }}>
        Scroll
      </button> */}
      
      <button onClick={setLengthActive} style={{ marginLeft: "10px" }}>
        Length
      </button>
      <button onClick={setWwwcActive} style={{ marginLeft: "10px" }}>
        WWWC
      </button>
      <button onClick={setEraserActive} style={{ marginLeft: "10px" }}>
        Eraser
      </button>
      <div class="container">
        <h1>&nbsp;</h1>
    </div>
      <div       style={{
        display: 'flex',
       
        justifyContent: 'center',
        
      }}
      className="dicom-wrapper">
        <div
          onContextMenu={() => false}
          className="dicom-viewer"

        >
          <div id="dicomImage"
          style={{ outline: "1px solid blue", width: "512px", height:"512px",alignItems: 'center', justifyContent: 'center'}} />
        </div>
      </div>
      <div class="container">
       <h1>&nbsp;</h1>
   </div>
      <div class = "info">
        
      <span> Transfer Syntax: </span><br></br>
      <span> SOP Class: </span><br></br>
      <span> Samples Per Pixel:</span><br></br>
      <span> Photometric Interpretation:</span><br></br>
      <span> Number Of Frames:</span><br></br>
      <span> Planar Configuration:</span><br></br>
      <span> Rows: </span><br></br>
      <span> Columns:</span><br></br>
      <span> Pixels Spacing: </span><br></br>
      <span> Column Pixel Spacing:</span><br></br>
      <span> Bits Allocated:</span><br></br>
      <span> Bits Stored: </span><br></br>
      <span> High Bit: </span><br></br>
      <span> Pixel Representation: </span><br></br>
      <span> WindowCenter: </span><br></br>
      <span> WindowWidth: </span><br></br>
      <span> RescaleIntercept: </span><br></br>
      <span> RescaleSlope:</span><br></br>
      <span> Basic Offset Table Entries:</span><br></br>
      <span>Fragments: </span><br></br>
      <span>Max Stored Pixel Value: </span><br></br>
      <span>Min Stored Pixel Value: </span><br></br>
      <span>Total Time: </span><br></br>
      <span>Decode Time: </span>
      </div>
       <div class="container">
       <h1>&nbsp;</h1>
   </div>
      </div>

  );
};

const setZoomActive = (e) => {
  const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;

  cornerstoneTools.addTool(ZoomMouseWheelTool);
  cornerstoneTools.setToolActive("ZoomMouseWheel", { mouseButtonMask: 1 });
  const PanTool = cornerstoneTools.PanTool;

  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 1 });
};

const setMouseWheelActive = (e) => {
  const StackScrollMouseWheelTool =
    cornerstoneTools.StackScrollMouseWheelTool;
  cornerstoneTools.addTool(StackScrollMouseWheelTool);
  cornerstoneTools.setToolActive("StackScrollMouseWheel", {});
};
//measurement function
const setLengthActive = (e) => {
  const LengthTool = cornerstoneTools.LengthTool;
  cornerstoneTools.addTool(LengthTool);
  cornerstoneTools.setToolActive("Length", { mouseButtonMask: 1 });
};
//brightness function
const setWwwcActive = (e) => {
  const WwwcTool = cornerstoneTools.WwwcTool;
  cornerstoneTools.addTool(WwwcTool);
  cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 });
};
//button to erase
const setEraserActive = (e) => {
  const EraserTool = cornerstoneTools.EraserTool;
  cornerstoneTools.addTool(EraserTool);
  cornerstoneTools.setToolActive("Eraser", { mouseButtonMask: 1 });
};

export default App;
