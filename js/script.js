'use strict'

document.addEventListener('DOMContentLoaded', () => {
  let globalCount = 0;

  /////////////////////////////////////////
  ///Initialize ERROR and MESSAGE alerts///
  //ERRORS
  const ERRORS = {
    errAll : document.getElementById('err-all'),
    errCode : document.getElementById('err-code'),
    errCount : document.getElementById('err-count'),
    errUpperCase : document.getElementById('err-upper-case')
  };
  //MESSAGES
  const MSG = {
    msgCheckCode : document.getElementById('msg-check-code'),
    msgCodeOk : document.getElementById('msg-code-ok')	
  };
  //////////////////////////////////////////
  //////////////////////////////////////////


  const submitButton = document.getElementById('submit-button');

  ///WORKS///
  // function checkInput(codeText, countText, ERRORS) {
  //   ERRORS.errAll.style.display = 'none';
  //   ERRORS.errCode.style.display = 'none';
  //   ERRORS.errCount.style.display = 'none';

  //   if (codeText === '' || countText === '') {
  //     ERRORS.errAll.style.display = 'block';
  //     return; // stop further execution		
  //   }
  //   if (Number(countText) > 23) {
  //     ERRORS.errCount.style.display = 'block';
  //     return; // stop further execution
  //   }

  // /////////////////////////////////
  // ///DOES NOT WORK PROPERLY
  //   // let flag = false;
  //   // MSG.msgCheckCode.style.display = 'block';
  //   // for (let i = 0; i < dataAll.length; i++) {
  //   //   console.log('inside for...');
  //   //   if (codeText === dataAll[i].subcode) {
  //   //     flag = true;
  //   //   }
  //   // }
  //   // MSG.msgCheckCode.style.display = 'none';
  //   // if (flag === false) {
  //   //   ERRORS.errCode.style.display = 'block';
  //   //   return; // stop further execution
  //   // }
  //   /////////////////////////////////
  // }
  ///////////
  ///WORKS///
  function buildData(dataAll, codeText) {
    let data = {};
    for (let i = 0; i < dataAll.length; i++) {
      if (codeText === dataAll[i].subcode) {
        data = {
          name: dataAll[i].name,
          process: dataAll[i].process,
          thread: dataAll[i].thread,
          size: dataAll[i].size,
          din: dataAll[i].din,
          material: dataAll[i].material,
          code: dataAll[i].subcode,
          qty: dataAll[i].qty,
          img: dataAll[i].img
        }
      }
    }
    return data;
  }
  ///////////

  function generateLabel(data, countText) {
    let i = 0;
    if (globalCount !== 0) {
      i = globalCount;
      countText = globalCount + Number(countText);
    }


    for (i = globalCount; i < countText; i++) {
      let label = document.getElementById(`label-${i}`);

      //Generate Name
      let name = document.createElement('p');
      name.id = `name-${i}`;
      name.classList.add('name');
      label.appendChild(name);
      name.innerHTML = data.name;

      //Generate Process and Thread
      let process = document.createElement('p');
      label.appendChild(process);
      process.id = `process-${i}`;
      process.classList.add('process');
      if (data.process) {
          if (data.thread) {
              process.innerHTML = `${data.process} ${data.thread}`;
          } else {
              process.innerHTML = `${data.process}`;
          }
      } else if (data.thread) {
          process.innerHTML = `${data.thread}`;
      } else {
          process.innerHTML = '';
      }

      //Generate Size
      let size = document.createElement('p');
      label.appendChild(size);
      size.id = `size-${i}`;
      size.classList.add('size');
      size.innerHTML = data.size;

      //Generate Din
      let din = document.createElement('p');
      label.appendChild(din);
      din.id = `din-${i}`;
      din.classList.add('din');
      if (data.din) {
          din.innerHTML = data.din;
      } else {
          din.innerHTML = '';
      }

      //Generate Material
      let material = document.createElement('p');
      label.appendChild(material);
      material.id = `material-${i}`;
      material.classList.add('material');
      if (data.material) {
          material.innerHTML = data.material;
      } else {
          material.innerHTML = '';
      }

      //Generate Quantity
      let qty = document.createElement('p');
      label.appendChild(qty);
      qty.id = `qty-${i}`;
      qty.classList.add('qty');
      qty.innerHTML = `${data.qty}`;
      let tmx = document.createElement('span');
      tmx.classList.add('tmx');
      tmx.innerHTML = 'ΤΜΧ.';
      qty.appendChild(tmx);

      //Generate Image
      let img = document.createElement('img');
      label.appendChild(img);
      img.id = `img-${i}`;
      img.classList.add('img');
      if (data.din) {
          img.src = `./img/${data.din}.jpg`;
      } else {
          img.style.display = 'none';
      }

      //Generate Barcode
      let codeLatin = convertGreekToLatin(data);
      

      JsBarcode(document.getElementById(`barcode-${i}`), codeLatin, {
          format: "CODE128",
          displayValue: false,
          fontSize: 20,
          height: 40,
          margin: 0,
          textMargin: 5,
          textAlign: "center",
          textPosition: "bottom",
          width: 1.6,
          background: "#ffffff",
          lineColor: "#000000",
          fontOptions: "bold"
      });
    }
    globalCount = Number(countText);
    console.log(globalCount);
  }

  ///WORKS//
  function convertGreekToLatin(data) {
    const greek_to_latin = {
        'Α':'A','Β':'B','Γ':'C','Δ':'D','Ε':'E','Ζ':'Z','Η':'H',
        'Θ':'G','Ι':'I','Κ':'K','Λ':'L','Μ':'M','Ν':'N','Ξ':'J',
        'Ο':'O','Π':'P','Ρ':'R','Σ':'S','Τ':'T','Υ':'Y','Φ':'F',
        'Χ':'X','Ψ':'U','Ω':'Q' 
    }
    const regex = new RegExp(Object.keys(greek_to_latin).join('|'), 'g');

    const replaceGreek = (str) => {
        return str.replace(regex, (match) => greek_to_latin[match]);
    }

    let codeLatin = replaceGreek(data.code);
    return codeLatin;
  }
  /////////


  let dataAll = [];
  fetch('./json/data.json').then(response => response.json()).then(data => {
    dataAll = data.map(item => {
      return {
        name: item.Name,
        process: item.Process,
        thread: item.Thread,
        size: item.Size,
        din: item.Din,
        material: item.Material,
        subcode: item.Subcode,
        qty: item.Qty,
        img: item.Img
      }
    });
    submitButton.addEventListener('click', function() {
      /////////////////////////////////////////
      /////////////////////////////////////////
      ///Get inputs, check for error and print alerts///
      const codeInput = document.getElementById('code-input');
      const codeText = codeInput.value.trim();
      const countInput = document.getElementById('count-input');
      const countText = countInput.value.trim();

      ERRORS.errAll.style.display = 'none';
      ERRORS.errCode.style.display = 'none';
      ERRORS.errCount.style.display = 'none';
      ERRORS.errUpperCase.style.display = 'none';
  
      if (codeText === '' || countText === '') {
        ERRORS.errAll.style.display = 'block';
        return; // stop further execution		
      }
      if (Number(countText) > 23) {
        ERRORS.errCount.style.display = 'block';
        return; // stop further execution
      }
      let temp = codeText.toUpperCase();
      if (temp !== codeText) {
        ERRORS.errUpperCase.style.display = 'block';
        return;
      }
      /////////////////////////////////////////
      /////////////////////////////////////////
  
      let data = buildData(dataAll, codeText);
      generateLabel(data, countText);
  
      ///CLEAR INPUT FIELDS///
      document.getElementById('code-input').value = '';
      document.getElementById('count-input').value = '';
    });
    let pdfbtn = document.getElementById('save-button');
    pdfbtn.addEventListener('click', function () {
      var element = document.getElementById('label-container');
      html2pdf()
        .set({
          margin: 0,
          filename: 'labels.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { dpi: 192, scale: 4, letterRendering: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(element)
        .save();
    });
  }).catch(error => {console.log('Error fetching data.json', error)});
});