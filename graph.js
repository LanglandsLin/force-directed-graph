 d3.csv("jazz.csv").then(function(data) {
    var forcelineWidth = 1;
    var forceLineColor = "#c6c6c6";
    var forceCircleR = 4;
    var forceCircleStroke = "#ffffff";
    var forceCircleStrokeWidth = 0.5;
    var forceOpacity = 0.8;
    var unselecetedColor = "#ffffff";

    var force_height = window.innerHeight;
    var force_width = window.innerWidth;
    var svg = d3.select('#mid')
                .append("svg")
                .attr("float","none")
                .attr("height",force_height)
                .attr("width",force_width);
    Data = data;
    node_len = 198;
    // for(var i=0;i<node_len;i++){
    //   for (var j=0; j<node_len;j++){
    //       if (Math.random()<1){
    //         Data[i][j] = 0;
    //         Data[j][i] = 0;
    //       }
    //       //Data[i][j] = 1;
    //   }
    //     //console.log(svg_edges);
    // }

    // for (var j=0; j<node_len;j++){
    //   Data[0][j] = 1;
    //   Data[j][0] = 1;
    // }

    //console.log(Data);
// function drawforce(nodes,edges,svg){
//     var nodesid=[];
//     for(var i=0;i<nodes.length;i++){
//         nodesid.push({
//             name:parseInt(nodes[i].id)
//         })
//     }
//     var links=[];
//     for(i=0;i<edges.length;i++){
//         links.push({
//             source:parseInt(edges[i].source),
//             target:parseInt(edges[i].target)
//         })
//     }

var nodes = [];
for (var i = 0 ; i < node_len; i++){
    nodes.push({
    id:parseInt(i),
    x:parseInt(Math.random()*force_width),
    y:parseInt(Math.random()*force_height)
    // x:force_width/2,
    // y:force_height/2
    })
}
console.log(nodes);
// console.log(links);
var forceData = []
for(var i=0;i<node_len;i++){
  for (var j=0; j<node_len;j++){
    if (Data[i][j] == 1){
      forceData.push({
          source:parseInt(i),
          target:parseInt(j)
      })
    }
  }
    //console.log(svg_edges);
}
console.log(forceData);

var links = [];
for(var i = 0 ;i < forceData.length ; i++){
    links.push({
    source:nodes[parseInt(forceData[i].source)],
    target:nodes[parseInt(forceData[i].target)]
    })
}


function delta(a, b, m){
  if (m == 'x'){
    return a.x - b.x
  }
  return a.y - b.y
  //return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2))
}

function distance(a, b){
  return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2))
}

function energe(d, m){
  var k = 0.75 * Math.sqrt(force_width * force_height / node_len);
  eps = 1e-5;

  var repell = Math.sign(delta(d, {id:-1,x:force_width/2,y:force_height/2}, m)) * 1 / Math.abs((delta(d, {id:-1,x:force_width/2,y:force_height/2}, m) + eps));
  for (var i = 0; i < node_len; i++){
    if (d.id != i){
      if (Math.abs(delta(d, nodes[i], m)) > 1) {
        repell += Math.sign(delta(d, nodes[i], m)) * 1 / Math.abs(distance(d, nodes[i]) + eps)
      } else {
        repell += (Math.random() - 0.5) / 0.5 * 10;
      }
    }
  }
  var appeal = 0;
  for (var i = 0; i < node_len; i++){
    if (Data[d.id][i] == 1){
      appeal -= Math.sign(delta(d, nodes[i], m)) * Math.pow(distance(d, nodes[i]), 2)
    }
  }
  return k * k * repell + appeal / k
}

function min_energe(d, lr){
  dx = energe(d, 'x');
  dy = energe(d, 'y');
  // grad_x = (energe({id:d.id,x:d.x + dx,y:d.y}, 'x') - energe(d, 'x')) / dx;
  // grad_y = (energe({id:d.id,x:d.x,y:d.y + dy}, 'y') - energe(d, 'y')) / dy;

  d.x = d.x + Math.sign(dx) * Math.min(Math.abs(dx), lr);
  d.y = d.y + Math.sign(dy) * Math.min(Math.abs(dy), lr);
  d.x = Math.min(force_width, Math.max(0, d.x));
  d.y = Math.min(force_height, Math.max(0, d.y));
}

function iterate(epoch){
  var lr = 50;
  for (var j = 0; j < epoch; j++){
    //lr = lr / (j + 1);
     if (j > 100) lr = 10;
     if (j > 300) lr = 1;
    var gx = 0;
    var gy = 0;
    for (var i = 0; i < node_len; i++){
      min_energe(nodes[i], lr);
      gx += nodes[i].x;
      gy += nodes[i].y;
      // node = node
      //                 //.data(nodes)
      //                 .transition().duration(600)
      //                 .attr("cx", d => d.x)
      //                 .attr("cy", d => d.y)
      //                 .attr("fill", unselecetedColor)
      //
      // link = link
      //                 //.data(links)
      //                 .transition().duration(600)
      //                 .attr("x1", d => d.source.x)
      //                 .attr("y1", d => d.source.y)
      //                 .attr("x2", d => d.target.x)
      //                 .attr("y2", d => d.target.y)
    }
    gx = gx / node_len;
    gy = gy / node_len;
    for (var i = 0; i < node_len; i++){
      nodes[i].x = nodes[i].x + force_width / 2 - gx;
      nodes[i].y = nodes[i].y + force_height / 2 - gy;
    }
    // node = node
    //                 //.data(nodes)
    //                 .transition().duration(600)
    //                 .attr("cx", d => d.x)
    //                 .attr("cy", d => d.y)
    //                 .attr("fill", unselecetedColor)
    //
    // link = link
    //                 //.data(links)
    //                 .transition().duration(600)
    //                 .attr("x1", d => d.source.x)
    //                 .attr("y1", d => d.source.y)
    //                 .attr("x2", d => d.target.x)
    //                 .attr("y2", d => d.target.y)
  }
}

var node = svg.append("g")
                // .attr("stroke", "#999")
                // .attr("stroke-width", 1)
                .selectAll("circle")
                .data(nodes)
                .join("circle")
                .attr("r", 5)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("fill", "#fff")

var link = svg.append("g")
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
                .selectAll("line")
                .data(links)
                .join("line")
                .attr("opacity", 0.3)
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y)

iterate(1000);
//
node = node
                //.data(nodes)
                .transition().duration(600)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("fill", unselecetedColor)

link = link
                //.data(links)
                .transition().duration(600)
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y)


  // setInterval(function () {
  //
  //   iterate(1000);
  //
  //   node = node
  //                   .data(nodes)
  //                   .transition().duration(600)
  //                   .attr("cx", d => d.x)
  //                   .attr("cy", d => d.y)
  //                   .attr("fill", unselecetedColor)
  //
  //   link = link
  //                   .data(links)
  //                   .transition().duration(600)
  //                   .attr("x1", d => d.source.x)
  //                   .attr("y1", d => d.source.y)
  //                   .attr("x2", d => d.target.x)
  //                   .attr("y2", d => d.target.y)
  //
  // }, 1000);


                    //.call(d3.drag().on("start",dragstarted).on("drag",dragged).on("end",dragended));
//    console.log("end")
})
