var view;
var ctx;
var polygons = {
    convex: {
        color: '#0000FF', // choose color here!
        vertices: [
            [200,250],[400,250],[550,400],[350,550],[150,350]
        ]
    },
    concave: {
        color: '#00FF00', // choose color here!
        vertices: [
            [100,250],[550,100],[450,350],[700,550],[300,400]
        ]
    },
    self_intersect: {
        color: '#FF0000', // choose color here!
        vertices: [
            [100,250],[250,100],[450,400],[450,200],[200,400]
        ]
    },
    interior_hole: {
        color: '#000000', // choose color here!
        vertices: [
            [400,50],[350,550],[50,250],[700,200],[200,350]
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

    var vert1 = polygon.vertices[0];
    var vert2 = polygon.vertices[1];
    var vert3 = polygon.vertices[2];
    var vert4 = polygon.vertices[3];
    var vert5 = polygon.vertices[4];
    DrawLine(vert1[0],vert1[1],vert2[0],vert2[1]);
    DrawLine(vert2[0],vert2[1],vert3[0],vert3[1]);
    DrawLine(vert3[0],vert3[1],vert4[0],vert4[1]);
    DrawLine(vert4[0],vert4[1],vert5[0],vert5[1]);
    DrawLine(vert5[0],vert5[1],vert1[0],vert1[1]);
    console.log(polygon.vertices[0])

    var minimumY=view.height;
    for(var i = 0; i<polygon.vertices.length; i++){
        var vert1 = polygon.vertices[i];
        var vert2;
        if(i === polygon.vertices.length-1){
            vert2 = polygon.vertices[0];
        }
        else{
            vert2 = polygon.vertices[i+1];
        }
        //now add to the ET
        console.log("vert1: "+vert1);
        console.log("vert2: "+vert2);

        var y_max;
        var x_bottom;
        var y_min;
        var edge;
        var deltaX = vert1[0]-vert2[0];
        var deltaY = vert1[1]-vert2[1]; //if this is positive vert1 is greater than vert2

        if(polygon.vertices[i][1]<minimumY){
            minimumY = polygon.vertices[i][1];
        }

        if(deltaY>0){ 
            y_max = vert1[1];
            x_bottom = vert2[0];
            y_min = vert2[1];
            edge = new EdgeEntry(y_max,x_bottom,deltaX,deltaY);
            edge_table[y_min].InsertEdge(edge);

        }else if (deltaY===0){
            //we don't draw and we dont need to add to the edge list because the deltaX/deltaY will be undefined
        }else{
            y_max = vert2[1];
            x_bottom = vert1[0];
            y_min = vert1[1]
            edge = new EdgeEntry(y_max,x_bottom,deltaX,deltaY);
            edge_table[y_min].InsertEdge(edge);
        }

        // console.log("edge: "+edge)
        console.log("Y Max: "+ y_max);
        console.log("X bottom: "+x_bottom);

        // 1/slope ( delta x / delta y) ----given that delta y is not 0, we don't draw if delta x is 0 either

    }
    console.log("Edge Table" +edge_table[350].first_entry)
    console.log("Minimum y: "+minimumY)
    // Step 2: set y to first scan line with an entry in ET

    console.log("just before the while loop")

    if(edge_table[minimumY].first_entry!==null){
        console.log("in if statement")
        var first_edge = edge_table[minimumY].first_entry;
        active_list.InsertEdge(first_edge);
        while(first_edge.next_entry!==null){
            active_list.InsertEdge(first_edge.next_entry);
            first_edge = first_edge.next_entry;
        }
    }   

    while(edge_table[minimumY].first_entry!==null || active_list.first_entry!==null){
        console.log("got into the first while loop")
        //adds edges to active list

        active_list.SortList();
        active_list.RemoveCompleteEdges(minimumY);
        var first_al_edge = active_list.first_entry;
        var second_al_edge = first_al_edge.next_entry;

        var x1 = first_al_edge.x;
        var x2 = second_al_edge.x;
        x1 = Math.round(x1+.4999);
        x2 = Math.round((x2+.5)-1)
        console.log("While X1: "+x1);
        console.log("While X2: "+x2);

        if(x1<=x2){
            DrawLine(x1, minimumY, x2, minimumY);
        }
        first_al_edge.x = first_al_edge.x + first_al_edge.inv_slope;
        second_al_edge.x = second_al_edge.x + second_al_edge.inv_slope;

        while(second_al_edge.next_entry!==null){
            
            first_al_edge = second_al_edge.next_entry;
            second_al_edge = first_al_edge.next_entry;
            x1 = first_al_edge.x;
            x2 = second_al_edge.x;
            x1 = Math.round(x1+.4999);
            x2 = Math.round((x2+.5)-1)
            if(x1<=x2){
                DrawLine(x1, minimumY, x2, minimumY);
            }
            first_al_edge.x = first_al_edge.x + first_al_edge.inv_slope;
            second_al_edge.x = second_al_edge.x + second_al_edge.inv_slope;
        }
        minimumY++;
        if(edge_table[minimumY].first_entry!==null){
            var first_edge = edge_table[minimumY].first_entry;
            active_list.InsertEdge(first_edge);
            while(first_edge.next_entry!==null){
                active_list.InsertEdge(first_edge.next_entry);
                first_edge = first_edge.next_entry;
            }
        }
    }

    
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
