/*
  ~  Copyright 2017 Ripple Foundation C.I.C. Ltd
  ~  
  ~  Licensed under the Apache License, Version 2.0 (the "License");
  ~  you may not use this file except in compliance with the License.
  ~  You may obtain a copy of the License at
  ~  
  ~    http://www.apache.org/licenses/LICENSE-2.0

  ~  Unless required by applicable law or agreed to in writing, software
  ~  distributed under the License is distributed on an "AS IS" BASIS,
  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~  See the License for the specific language governing permissions and
  ~  limitations under the License.
*/

let templateMedicationsCreate = require('./medications-create.html');

class MedicationsCreateController {
  constructor($scope, $state, $stateParams, $ngRedux, medicationsActions, serviceRequests, usSpinnerService, serviceFormatted) {
    $scope.actionLoadList = medicationsActions.all;
    $scope.actionCreateDetail = medicationsActions.create;

    $scope.medication = {};
        
    $scope.medication.isImport = false;
    $scope.medication.originalSource = '';
		$scope.medication.originalComposition = '';

    if ($stateParams.importData) {
			$scope.medication = {
				...$stateParams.importData.data
			};
    }

    if (typeof $scope.medication.startDate == "undefined") {
      $scope.medication.startDate = new Date();
    }
    /* istanbul ignore next */
    this.backToDocs = function () {
      $state.go('documents-detail', {
        patientId: $stateParams.patientId,
        detailsIndex: $stateParams.importData.documentIndex,
        page: 1
      });
    };


    $scope.terminology = "IMF";

    $scope.getlists = function ()
    {
	$scope.medicationarray = [];
	$scope.medicationarray1 = [];
	$scope.medicationarray2 = [];

	var httpurl = "http://206.81.24.158/test.php";
    
	if($scope.terminology == "IMF")
	{
	   	var vtmapi = "getIMFVTMs";
		var vmpapi = "getIMFVMPs";
		var ampapi = "getIMFAMPs";
	}
	else if ($scope.terminology == "IPU")
	{
                var vtmapi = "getIPUVTMs";
                var vmpapi = "getIPUVMPs";
                var ampapi = "getIPUAMPs";
	}
	else if ($scope.terminology == "DMD")
	{
                var vtmapi = "getDMDVTMs";
                var vmpapi = "getDMDVMPs";
                var ampapi = "getDMDAMPs";
	}
   
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function()
	{

        	if (xmlHttp.readyState == 4 && xmlHttp.status == 200)

			if(typeof(xmlHttp.responseText) == "string")
			{
				var xmlout = xmlHttp.responseText.substring(1, xmlHttp.responseText.length);
				//console.log(xmlHttp.responseText);
				//console.log(xmlout);
				//$scope.responsetest = "well at least it gets this far";
                		var parser = new DOMParser();
	        		var xmlDoc = parser.parseFromString(xmlHttp.responseText,"text/xml");
				if(typeof(xmlDoc) != "undefined")
				{
					//$scope.responsetest = "assigning values";
                			for(var i = 0; i < xmlDoc.getElementsByTagName("NM").length; i++)
	         			{
						//console.log(xmlDoc);
						$scope.responetest = xmlDoc;
			 			$scope.medications = new Object();
	         				$scope.medications.name = xmlDoc.getElementsByTagName("NM")[i].childNodes[0].nodeValue;
						$scope.medications.id = xmlDoc.getElementsByTagName("VTMID")[i].childNodes[0].nodeValue;
			 			$scope.medicationarray.push($scope.medications);
                    			}
				}
	      		}
	}
        xmlHttp.open("GET", httpurl + "?API=" + vtmapi, true); // true for asynchronous 
        xmlHttp.send(null);

        var xmlHttp1 = new XMLHttpRequest();
        xmlHttp1.onreadystatechange = function() 
	{
            if (xmlHttp1.readyState == 4 && xmlHttp1.status == 200)
		//console.log(xmlHttp1.responseText); 
	      if(typeof(xmlHttp1.responseText) == "string")
	      {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xmlHttp1.responseText, "text/xml");
                for (var i = 0; i < xmlDoc.getElementsByTagName("NM").length; i++) 
		{
		    $scope.medications = new Object();
		    $scope.medications.name = xmlDoc.getElementsByTagName("NM")[i].childNodes[0].nodeValue;
		    $scope.medications.id = xmlDoc.getElementsByTagName("VMPID")[i].childNodes[0].nodeValue; //VMP
		    $scope.medicationarray1.push($scope.medications);
                }
	      }
        }
        xmlHttp1.open("GET", httpurl + "?API=" + vmpapi, true); // true for asynchronous
        xmlHttp1.send(null);
    
        var xmlHttp2 = new XMLHttpRequest();
   	xmlHttp2.onreadystatechange = function() 
	{
	    console.log("testhttp2");
   	    if (xmlHttp2.readyState == 4 && xmlHttp2.status == 200)
		console.log(xmlHttp2.responseText);
   	        var parser = new DOMParser();
   	        var xmlDoc = parser.parseFromString(xmlHttp2.responseText, "text/xml");
		console.log(xmlDoc);
   	        for (var i = 0; i < xmlDoc.getElementsByTagName("NM").length; i++) 
		{
		    $scope.medications = new Object();
		    $scope.medications.name = xmlDoc.getElementsByTagName("NM")[i].childNodes[0].nodeValue;
		    $scope.medications.id = xmlDoc.getElementsByTagName("AMPID")[i].childNodes[0].nodeValue; //AMPID
		    $scope.medicationarray2.push($scope.medications);
   	        }
	}
        xmlHttp2.open("GET", httpurl + "?API=" + ampapi, true); // true for asynchronous
        xmlHttp2.send(null);
    }

    $scope.getlists();
    $scope.idvmpandamp = "";
    $scope.idamp = "";
    $scope.medication1 = "";
    $scope.medication2 = "";
    $scope.medicationfinal = "";

    $scope.vmpandampparse = function()
    {
        $scope.medicationarray1 = [];
	$scope.medicationarray2 = [];
	$scope.medication1 = "";
	$scope.medication2 = "";
	var httpurl = "http://206.81.24.158/test.php";

	for(var o = 0; o < $scope.medicationarray.length; o++)
	{
	    if($scope.medicationarray[o].name == $scope.medication.name)
	    {
		$scope.idvmpandamp = $scope.medicationarray[o].id;
	    }
	}

	if ($scope.terminology == "IMF") 
	{
            var vmpapi = "getIMFVMPs";
            var ampapi = "getIMFAMPs";
        } 
        else if ($scope.terminology == "IPU") 
	{
            var vmpapi = "getIPUVMPs";
            var ampapi = "getIPUAMPs";
        } 
        else if ($scope.terminology == "DMD") 
	{
            var vmpapi = "getDMDVMPs";
            var ampapi = "getDMDAMPs";
        }
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() 
        {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) 
		var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xmlHttp.responseText, "text/xml");
                for (var i = 0; i < xmlDoc.getElementsByTagName("NM").length; i++) 
		{
		    $scope.medications = new Object(); 
		    $scope.medications.name = xmlDoc.getElementsByTagName("NM")[i].childNodes[0].nodeValue;
	            $scope.medications.id = xmlDoc.getElementsByTagName("VMPID")[i].childNodes[0].nodeValue;
		    $scope.medicationarray1.push($scope.medications);
	        }
	 }
	 xmlHttp.open("GET", httpurl +"?API=" + vmpapi + "&ID=" + $scope.idvmpandamp, true); // true for asynchronou
         xmlHttp.send(null);

	var xmlHttp1 = new XMLHttpRequest();
	xmlHttp1.onreadystatechange = function()
	{
	    if (xmlHttp1.readyState == 4 && xmlHttp1.status == 200)
		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(xmlHttp1.responseText, "text/xml");
		for (var i = 0; i <xmlDoc.getElementsByTagName("NM").length; i++)
		{
		    $scope.medications = new Object();
		    $scope.medications.name = xmlDoc.getElementsByTagName("NM")[i].childNodes[0].nodeValue;
		    $scope.medications.id = xmlDoc.getElementsByTagName("AMPID")[i].childNodes[0].nodeValue;
		    $scope.medicationarray2.push($scope.medications);
		}
	}
	xmlHttp1.open("GET", httpurl + "?API=" + ampapi + "&ID=" + $scope.idvmpandamp, true);
	xmlHttp1.send(null);
    }


    $scope.ampparse = function() 
    {
	//$scope.medication.name = "";
	$scope.medication2 = "";

	for(var p = 0; p < $scope.medicationarray1.length; p++)
	{
	    if($scope.medicationarray1[p].name == $scope.medication1)
	    {
		$scope.idamp = $scope.medicationarray1[p].id;
	    }
	}

	var httpurl = "http://206.81.24.158/test.php";

        $scope.medicationarray2 = [];
        if ($scope.terminology == "IMF") 
        {
            var ampapi = "getIMFAMPs";
        } 
	else if ($scope.terminology == "IPU") 
        {
            var ampapi = "getIPUAMPs";
        } 
  	else if ($scope.terminology == "DMD") 
        {
            var ampapi = "getDMDAMPs";
        }
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() 
        {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(xmlHttp.responseText, "text/xml");
            	for (var i = 0; i < xmlDoc.getElementsByTagName("NM").length; i++) {
                	$scope.medications = new Object();
                	$scope.medications.name = xmlDoc.getElementsByTagName("NM")[i].childNodes[0].nodeValue;
                	$scope.medications.id = xmlDoc.getElementsByTagName("AMPID")[i].childNodes[0].nodeValue;
               		$scope.medicationarray2.push($scope.medications);
		}
        }
        xmlHttp.open("GET", httpurl + "?API=" + ampapi + "&ID=" + $scope.idamp, true);
        xmlHttp.send(null);
    } 

    //$scope.clearlessamp = function()
    //{
//	$scope.medication.name = "";
	$scope.medication1 = "";
  //  }

    $scope.searchvalue = "";

    $scope.searcharrayfunc = function ()
    {
	$scope.medicationsearcharray = [];
	for (var i = 0; i < $scope.medicationarray.length; i++)
	{
	    var arrayval = $scope.medicationarray[i].name;
	    var arrayvallower = arrayval.toString().toLowerCase();
	    var match = arrayvallower.indexOf($scope.searchvalue);
	    if (match == -1)
	    {
		$scope.medicationarray.splice(i, 1);
		i = i -1;
	    }
	}
    }

    $scope.resetsearch = function ()
    {
	$scope.medication.name = "";
	$scope.medication1 = "";
	$scope.medication2 = "";

	$scope.getlists();
    }

    //Create Medication
    $scope.routes = [
      'Po Per Oral',
      'IV Intra Venous',
      'PN Per Nasal',
      'PR Per Rectum',
      'SL Sub Lingual',
      'SC Sub Cutaneous',
      'IM Intra Muscular'
    ];
    /* istanbul ignore next */
    this.goList = function () {
      $state.go('medications', {
        patientId: $stateParams.patientId,
        reportType: $stateParams.reportType,
        searchString: $stateParams.searchString,
        queryType: $stateParams.queryType
      });
    };
    /* istanbul ignore next */
    this.cancel = function () {
      this.goList();
    };
    /* istanbul ignore next */
    $scope.create = function (medicationForm, medication) {
      $scope.formSubmitted = true;
      if (medicationForm.$valid) {
        let now = new Date();
        let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let startTime = now - today;
	if($scope.medication2 != "")
	{
		$scope.medicationfinal = $scope.medication2;
	}
	else if($scope.medication1 != "")
	{
		$scope.medicationfinal = $scope.medication1;
	}
	else if($scope.medication.name != "")
	{
	    $scope.medicationfinal = $scope.medication.name;
	}
		  
        let toAdd = {
          sourceId: '',
          doseAmount: medication.doseAmount,
          doseDirections: medication.doseDirections,
          doseTiming: medication.doseTiming,
          medicationCode: "123456789",
          medicationTerminology: medication.medicationTerminology,
	  name: $scope.medicationfinal,
          route: medication.route,
          startDate: medication.startDate.getTime(),
          startTime: startTime,
          author: medication.author,
          dateCreated: medication.dateCreated,
          isImport: medication.isImport || false,
          originalSource: medication.originalSource || '',
          originalComposition: medication.originalComposition || ''
        };

        serviceFormatted.propsToString(toAdd, 'startDate', 'startTime', 'dateCreated', 'isImport');
        $scope.actionCreateDetail($stateParams.patientId, toAdd);
      }
    };
    /* istanbul ignore next */
    this.setCurrentPageData = function (store) {
      if (store.medication.dataCreate !== null) {
        $scope.actionLoadList($stateParams.patientId);
        this.goList();
      }
      if (serviceRequests.currentUserData) {
        $scope.currentUser = serviceRequests.currentUserData;
        $scope.medication.author = $scope.currentUser.email;
      }
    };

    let unsubscribe = $ngRedux.connect(state => ({
      getStoreData: this.setCurrentPageData(state)
    }))(this);
    $scope.$on('$destroy', unsubscribe);
  }
}

const MedicationsCreateComponent = {
  template: templateMedicationsCreate,
  controller: MedicationsCreateController
};

MedicationsCreateController.$inject = ['$scope', '$state', '$stateParams', '$ngRedux', 'medicationsActions', 'serviceRequests', 'usSpinnerService', 'serviceFormatted'];
export default MedicationsCreateComponent;
