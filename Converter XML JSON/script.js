function converterXmlParaJson() {
  const xmlText = document.getElementById("xmlInput").value

  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml")
    const obj = xmlToJson(xml)
    document.getElementById("jsonOutput").value = JSON.stringify(obj, null, 2)
  } catch (e) {
    alert("Erro ao converter XML para JSON")
  }
}

function converterJsonParaXml() {
  const jsonText = document.getElementById("jsonOutput").value

  try {
    const obj = JSON.parse(jsonText)
    const xml = jsonToXml(obj)
    document.getElementById("xmlSaida").value = xml
  } catch (e) {
    alert("Erro ao converter JSON para XML")
  }
}


function xmlToJson(xml) {
  if (xml.nodeType === 3) {
    return xml.nodeValue.trim()
  }

  let obj = {}

  
  if (xml.attributes && xml.attributes.length > 0) {
    obj["@attributes"] = {}
    for (let i = 0; i < xml.attributes.length; i++) {
      const attr = xml.attributes.item(i)
      obj["@attributes"][attr.nodeName] = attr.nodeValue
    }
  }

  
  const children = Array.from(xml.childNodes).filter(n => n.nodeType !== 8)

  if (children.length === 0) {
    return ""
  }

  for (let child of children) {
    const name = child.nodeName
    const value = xmlToJson(child)

    
    if (typeof value === "string" && value.trim() === "") continue

    if (obj[name]) {
      if (!Array.isArray(obj[name])) {
        obj[name] = [obj[name]]
      }
      obj[name].push(value)
    } else {
      obj[name] = value
    }
  }

  return obj
}


function jsonToXml(obj, nodeName = "root") {
  let xml = ""

  if (typeof obj === "object" && !Array.isArray(obj)) {
    xml += `<${nodeName}>`
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        xml += jsonToXml(obj[key], key)
      }
    }
    xml += `</${nodeName}>`
  } else if (Array.isArray(obj)) {
    for (let item of obj) {
      xml += jsonToXml(item, nodeName)
    }
  } else {
    xml += `<${nodeName}>${obj}</${nodeName}>`
  }

  return xml
}