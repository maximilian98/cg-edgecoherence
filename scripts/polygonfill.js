var view;
var ctx;
var polygons = {
    convex: {
        color: '', // choose color here!
        vertices: [
            // fill in vertices here!
        ]
    },
    concave: {
        color: '', // choose color here!
        vertices: [
            // fill in vertices here!
        ]
    },
    self_intersect: {
        color: '#FF0000', // choose color here!
        vertices: [
            [2,5],[5,2],[9,8],[9,4],[4,8]
        ]
    },
    interior_hole: {
        color: '', // choose color here!
        vertices: [
            // fill in vertices here!
        ]
    }
};

// Init(): triggered when web page loads
function Init() {
    var w = 800;
    var h = 600;
    view = document.getElementById('view');
    view.width = w;
    view.height = h;

    ctx = view.getContext('2d');


    console.log("Hello");
    SelectNewPolygon();
}

// DrawPolygon(polygon): erases current framebuffer, then draws new polygon
function DrawPolygon(polygon) {
    // Clear framebuffer (i.e. erase previous content)
    ctx.clearRect(0, 0, view.width, view.height);

    // Set line stroke color
    ctx.strokeStyle = polygon.color;

    // Create empty edge table (ET)
    var edge_table = [];
    var i;
    for (i = 0; i < view.height; i++) {
        edge_table.push(new EdgeList());
    }

    // Create empty active list (AL)
    var active_list = new EdgeList();


    // Step 1: populate ET with edges of polygon

    var count = 0;
    console.log(polygon.vertices);
    var vert1 = polygon.vertices[0];
    console.log(vert1);
    var vert2 = polygon.vertices[1];
    console.log(vert2);

    var vert3 = polygon.vertices[2];
    var vert4 = polygon.vertices[3];
    var vert5 = polygon.vertices[4];
    
    var x1 = vert1[0];
    var y1 = vert1[1];
    var x2 = vert2[0];
    var y2 = vert2[1];
    console.log("X1: "+x1);
    console.log("Y1: "+y1);
    console.log("X2: "+x2);
    console.log("Y2: "+y2);
    DrawLine(x1,y1,x2,y2);
    DrawLine(vert2[0],vert2[1],vert3[0],vert3[1]);
    DrawLine(vert3[0],vert3[1],vert4[0],vert4[1]);
    DrawLine(vert4[0],vert4[1],vert5[0],vert5[1]);
    DrawLine(vert5[0],vert5[1],vert1[0],vert1[1]);
    
    // Step 2: set y to first scan line with an entry in ET


    // Step 3: Repeat until ET[y] is NULL and AL is NULL
    //   a) Move all entries at ET[y] into AL
    //   b) Sort AL to maintain ascending x-value order
    //   c) Remove entries from AL whose ymax equals y
    //   d) Draw horizontal line for each span (pairs of entries in the AL)
    //   e) Increment y by 1
    //   f) Update x-values for all remaining entries in the AL (increment by 1/m)
}

// SelectNewPolygon(): triggered when new selection in drop down menu is made
function SelectNewPolygon() {
    var polygon_type = document.getElementById('polygon_type');
    DrawPolygon(polygons[polygon_type.value]);
}

function DrawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
