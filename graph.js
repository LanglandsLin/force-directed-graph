 d3.csv("jazz.csv").then(function(data) {
   var eta = 1;
   var sliderSimple = d3
                         .sliderBottom()
                         .min(0)
                         .max(1)
                         .width(300)
                         .ticks(5)
                         .default(1)
                         .on('onchange', val => {
                           eta = val;
                           iterate(10);
                           //
                           d3.selectAll("circle")
                             //.data(nodes)
                             .transition().duration(100)
                             .attr("cx", d => d.x)
                             .attr("cy", d => d.y)

                           d3.selectAll(".forceline")
                                           //.data(links)
                             .transition().duration(100)
                             .attr("x1", d => nodes[d.source].x)
                             .attr("y1", d => nodes[d.source].y)
                             .attr("x2", d => nodes[d.target].x)
                             .attr("y2", d => nodes[d.target].y)
                             });

   var gSimple = d3
                         .select('div#slider-simple')
                         .append('svg')
                         .attr('width', window.innerWidth)
                         .attr('height', 100)
                         .append('g')
                         .attr('transform', 'translate(30,30)');

   gSimple.call(sliderSimple);



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
    //       if (Math.random()<0.5){
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
var links = []
for(var i=0;i<node_len;i++){
  for (var j=0; j<node_len;j++){
    if (Data[i][j] == 1){
      links.push({
          source:parseInt(i),
          target:parseInt(j)
      })
    }
  }
    //console.log(svg_edges);
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

function force(d, m){
  var k = 0.75 * Math.sqrt(force_width * force_height / node_len) * eta;
  eps = 1e-5;

  var repell = Math.sign(delta(d, {id:-1,x:force_width/2,y:force_height/2}, m)) * 1 / Math.abs((distance(d, {id:-1,x:force_width/2,y:force_height/2}) + eps));
  //var repell = 0;
  for (var i = 0; i < node_len; i++){
    if (d.id != i){
      if (Math.abs(delta(d, nodes[i], m)) != 0) {
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
  return k * k * repell + appeal / (k + eps)
}

function min_force(d, lr){
  dx = force(d, 'x');
  dy = force(d, 'y');

  // console.log(dx);
  // console.log(dy);
  // grad_x = (force({id:d.id,x:d.x + dx,y:d.y}, 'x') - force(d, 'x')) / dx;
  // grad_y = (force({id:d.id,x:d.x,y:d.y + dy}, 'y') - force(d, 'y')) / dy;

  d.x = d.x + Math.sign(dx) * Math.min(Math.abs(dx), lr);
  d.y = d.y + Math.sign(dy) * Math.min(Math.abs(dy), lr);
  d.x = Math.min(force_width, Math.max(0, d.x));
  d.y = Math.min(force_height, Math.max(0, d.y));
}

function iterate(epoch){
  var lr = 30;
  for (var j = 0; j < epoch; j++){
    //lr = lr / (j + 1);
     // if (j > 100) lr = 10;
     // if (j > 300) lr = 1;
     //if (j > 700) lr = 50;
    var gx = 0;
    var gy = 0;
    for (var i = 0; i < node_len; i++){
      min_force(nodes[i], lr);
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
    // if (j == 100){
    //   node = node
    //                   //.data(nodes)
    //                   .transition().duration(600)
    //                   .attr("cx", d => d.x)
    //                   .attr("cy", d => d.y)
    //                   .attr("fill", unselecetedColor)
    //
    //   link = link
    //                   //.data(links)
    //                   .transition().duration(600)
    //                   .attr("x1", d => d.source.x)
    //                   .attr("y1", d => d.source.y)
    //                   .attr("x2", d => d.target.x)
    //                   .attr("y2", d => d.target.y)
    // }
  }
}

var node = svg.append("g")
                // .attr("stroke", "black")
                // .attr("stroke-width", 0.5)
                .selectAll("circle")
                .data(nodes)
                .join("circle")
                .attr("r", 3)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("fill", "black")
                .call(d3.drag().on("start", started))

var link = svg.append("g")
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
                .selectAll("line")
                .data(links)
                .join("line")
                .attr("opacity", 0.25)
                .attr("class", "forceline")
                .attr("x1", d => nodes[d.source].x)
                .attr("y1", d => nodes[d.source].y)
                .attr("x2", d => nodes[d.target].x)
                .attr("y2", d => nodes[d.target].y)

function started(){
  var circle = d3.select(this).classed("dragging", true);

  d3.event.on("drag", dragged).on("end", ended);

  function dragged(d, i) {
    // iterate(1);
    // for (var i = 0; i < 10; i++){
    //   iterate(10);
    //   nodes[i].x = d3.event.x;
    //   nodes[i].y = d3.event.y;
    // }
    nodes[i].x = d3.event.x;
    nodes[i].y = d3.event.y;
    iterate(1);
    nodes[i].x = d3.event.x;
    nodes[i].y = d3.event.y;
    circle.attr("cx", d => d.x).attr("cy", d => d.y);
    d3.selectAll("circle")
      //.data(nodes)
      .transition().duration(200)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)

    d3.selectAll(".forceline")
      .filter(function(d) { return d.source == i; })
                      //.data(links)
      .attr("x1", d => nodes[d.source].x)
      .attr("y1", d => nodes[d.source].y)

    d3.selectAll(".forceline")
      .filter(function(d) { return d.target == i; })
                      //.data(links)
      .attr("x2", d => nodes[d.target].x)
      .attr("y2", d => nodes[d.target].y)


    d3.selectAll(".forceline")
                    //.data(links)
      .transition().duration(200)
      .attr("x1", d => nodes[d.source].x)
      .attr("y1", d => nodes[d.source].y)
      .attr("x2", d => nodes[d.target].x)
      .attr("y2", d => nodes[d.target].y)

  }

  function ended() {
    circle.classed("dragging", false);
    iterate(10);
    d3.selectAll("circle")
      //.data(nodes)
      .transition().duration(600)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)

    d3.selectAll(".forceline")
                    //.data(links)
      .transition().duration(600)
      .attr("x1", d => nodes[d.source].x)
      .attr("y1", d => nodes[d.source].y)
      .attr("x2", d => nodes[d.target].x)
      .attr("y2", d => nodes[d.target].y)
  }
};

iterate(1000);
//
node = node
                //.data(nodes)
                .transition().duration(600)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)

link = link
                //.data(links)
                .transition().duration(600)
                .attr("x1", d => nodes[d.source].x)
                .attr("y1", d => nodes[d.source].y)
                .attr("x2", d => nodes[d.target].x)
                .attr("y2", d => nodes[d.target].y)


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
