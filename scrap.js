// EXAMPLE FOR VALIDATING NUMBER OF CHECKBOXES

<table id="tblFruits">
    <tr>
        <td><input id="chkMango" type="checkbox" value="1"/><label for="chkMango">Mango</label></td>
    </tr>
    <tr>
        <td><input id="chkApple" type="checkbox" value="2"/><label for="chkApple">Apple</label></td>
    </tr>
    <tr>
        <td><input id="chkBanana" type="checkbox" value="3"/><label for="chkBanana">Banana</label></td>
    </tr>
    <tr>
        <td><input id="chkGuava" type="checkbox" value="4"/><label for="chkGuava">Guava</label></td>
    </tr>
    <tr>
        <td><input id="chkOrange" type="checkbox" value="5"/><label for="chkOrange">Orange</label></td>
    </tr>
</table>
<br />
<input type = "button" value = "Check" onclick = "return Validate()" />
 
 
JavaScript function to check if multiple CheckBoxes are checked or not
When the Check Button is clicked, the Validate function gets called. Inside the Validate function, first the HTML Table is referenced and then all the CheckBoxes inside it are referenced.
Then using a loop, the Total count of the checked (selected) CheckBoxes is determined and displayed using JavaScript Alert Message Box.
And if none of the CheckBoxes are checked, then a message to select the CheckBoxes is displayed using JavaScript Alert Message Box.
<script type="text/javascript">
    function Validate() {
        var checked = 0;
 
        //Reference the Table.
        var tblFruits = document.getElementById("tblFruits");
 
        //Reference all the CheckBoxes in Table.
        var chks = tblFruits.getElementsByTagName("INPUT");
 
        //Loop and count the number of checked CheckBoxes.
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked) {
                checked++;
            }
        }
 
        if (checked > 0) {
            alert(checked + " CheckBoxe(s) are checked.");
            return true;
        } else {
            alert("Please select CheckBoxe(s).");
            return false;
        }
    };
</script>

//OLD SWITCH FUNCTION FOR CHECK BOXES
  // document.getElementById("checkBoxDiv").addEventListener("change", (event) => {
  //   let target = event.target;
  //   switch (target.id) {
  //     case "resUnits":
  //       renderFldPrefix = "resunits";
  //       console.log("resUnits checkbox");
  //       hexLayer.renderer = taxRenderer(renderFldPrefix, sliderValue.innerHTML);
  //       console.log(sliderValue.innerHTML);
  //       break;
  //     case "nonResSF":
  //       renderFldPrefix = "nonResSF";
  //       console.log("nonResSF checkbox");
  //       hexLayer.renderer = taxRenderer(renderFldPrefix, sliderValue.innerHTML);
  //       console.log(sliderValue.innerHTML);
  //       break;
  //     case "prYrVal":
  //       renderFldPrefix = "PYR_MARKET";
  //       console.log("prYrVal checkbox");
  //       hexLayer.renderer = taxRenderer(renderFldPrefix, sliderValue.innerHTML);
  //       console.log(sliderValue.innerHTML);
  //       break;
  //     case "prYrTax":
  //       renderFldPrefix = "PYR_TAXES";
  //       console.log("prYrTax checkbox");
  //       hexLayer.renderer = taxRenderer(renderFldPrefix, sliderValue.innerHTML);
  //       console.log(sliderValue.innerHTML);
  //       break;
  //     case "homesteads":
  //       renderFldPrefix = "homestead";
  //       break;
  //     case "numSales":
  //       renderFldPrefix = "numSales";
  //       break;
  //     case "valPerUnit":
  //       renderFldPrefix = "valPerUnit";
  //       break;
  //     case "taxPerUnit":
  //       renderFldPrefix = "taxPerUnit";
  //       break;
  //   }
  // });