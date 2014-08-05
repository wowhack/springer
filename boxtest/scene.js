var scene = {
    "textures": {}, 
    "exportpreset": "Maya2012", 
    "name": "untitled scene", 
    "geometry": {
        "geo0_geometry": {
            "type": "geometry", 
            "buffers": {
                "url": "boxtest/geo0geometry.bin", 
                "binary": true
            }
        }
    }, 
    "cameras": {}, 
    "keyframes": {}, 
    "materials": {
        "lambert1": {}
    }, 
    "root": {
        "children": {
            "|pCube1": {
                "scale": [
                    1.0, 
                    1.0, 
                    1.0
                ], 
                "objectID": 1, 
                "geometry": "geo0_geometry", 
                "material": "lambert1", 
                "position": [
                    0.0, 
                    0.0, 
                    0.0
                ], 
                "rotation": [
                    0.0, 
                    0.0, 
                    0.0, 
                    1.0
                ], 
                "type": "mesh", 
                "children": {}
            }
        }
    }
}

postMessage(scene);
