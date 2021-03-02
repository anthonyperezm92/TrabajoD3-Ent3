// Configuracion de margenes y altura
grafT2 = d3.select('#grafT2')
debugger;
anchoT2_totalT2 = graf.style('width').slice(0, -2)
altoT2_totalT2 = anchoT2_totalT2 * 9 / 16

grafT2.style('width', `${ anchoT2_totalT2 }px`)
    .style('height', `${ altoT2_totalT2 }px`)

marginsT2 = { top: 20, left: 50, right: 15, bottom: 120 }

anchoT2 = anchoT2_totalT2 - marginsT2.left - marginsT2.right
altoT2  = altoT2_totalT2 - marginsT2.top - marginsT2.bottom

// configuracion de svg
svgT2 = grafT2.append('svg')
          .style('width', `${ anchoT2_totalT2 }px`)
          .style('height', `${ altoT2_totalT2 }px`)

gT2 = svgT2.append('g')
        .attr('transform', `translate(${ marginsT2.left }, ${ marginsT2.top })`)
        .attr('width', anchoT2 + 'px')
        .attr('height', altoT2 + 'px')

// configuracion de escalas
yT2 = d3.scaleLinear()
          .range([altoT2, 0])

xT2 = d3.scaleBand()
      .range([0, anchoT2])
      .paddingInner(0.1)
      .paddingOuter(0.3)

colorT2 = d3.scaleOrdinal()
          .range(d3.schemeAccent)

// Se agrega los ejes
xAxisGroupT2 = gT2.append('g')
              .attr('transform', `translate(0, ${ altoT2 })`)
              .attr('class', 'eje')
yAxisGroupT2 = gT2.append('g')
              .attr('class', 'eje')

dataArrayT2 = []

// Selector de top
topSelectT2 = d3.select('#seltopT2')
metricaT2 = 'promedio'

// se crea el tooltip de ayuda
var tooltipT2 = d3.select("body").append("div").attr("class", "toolTip");

// render (update o dibujo)
function renderT2(dataT2) {
  // bind de los datos
  barsT2 = gT2.selectAll('rect')
            .data(dataT2, d => d.edad)
// dibujo y transicion de las barras
  barsT2.enter()
      .append('rect')
        .style('width', '0px')
        .style('height', '0px')
        .style('y', `${yT2(0)}px`)
        .style('fill', '#000')        
      .merge(barsT2)
        .transition()
        .duration(2000)
          .style('x', d => xT2(d.edad) + 'px')
          .style('y', d => (yT2(d[metricaT2])) + 'px')
          .style('height', d => (altoT2 - yT2(d[metricaT2])) + 'px')
          .style('fill', d => colorT2(d.edad))
          .style('width', d => `${xT2.bandwidth()}px`)

    // evento para msotrar el tooltip
          gT2.selectAll('rect')
            .on("mousemove", function(event,d){
              console.log(d);
              tooltipT2
                .style("left", event.pageX - 50 + "px")
                .style("top", event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html((d.Pais) + "<br>" +(d.edad) + "<br>" + "Promedio Suicidios: " + (d.promedio));
          })

  // transicion de salida
  barsT2.exit()
      .transition()
      .duration(2000)
        .style('height', '0px')
        .style('y', d => `${yT2(0)}px`)
        .style('fill', '#000000')
      .remove()

// efectos de transicion de los ejes
  yAxisCallT2 = d3.axisLeft(yT2)
                .ticks(10)
                .tickFormat(d => d + '')
  yAxisGroupT2.transition()
            .duration(2000)
            .call(yAxisCallT2)

  xAxisCallT2 = d3.axisBottom(xT2)
  xAxisGroupT2.transition()
            .duration(2000)
            .call(xAxisCallT2)
            .selectAll('text')
            .attr('x', '-8px')
            .attr('y', '-5px')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-60)')
}

//  Carga de datos desde csv
d3.csv('edad.csv')
.then(function(dataT2) {
  dataT2.forEach(d => {
    d.promedio = +d.promedio
  })

  dataArrayT2 = dataT2
// agregar domio de color
  colorT2.domain(dataT2.map(d => d.edad))
  var l = dataT2.map(d => d.Pais);
  
  // llenar option del select
  result = l.filter((item,index)=>{
    return l.indexOf(item) === index;
  })

  result.forEach(d => {
    topSelectT2.append('option')
                .attr('value', d)
                .text(d)
  })

  //  Despliegue
  frameT2()
})
.catch(e => {
  console.log('No se tuvo acceso al archivo ' + e.message)
})

function frameT2() {
  dataframeT2 = dataArrayT2

  // se obtiene el valor seleccionado
  var ps =   topSelectT2.node().value
  // mostrar el valor seleccionado en las etiquetas span
$('#id_pais').text(ps);
$('#id_pais2').text(ps);

// filtrar los datos por el filtro seleccionado
dataframeT2 = d3.filter(dataArrayT2, d => d.Pais == ps)


  // Calcular la altura maxima del eje
  maxyT2 = d3.max(dataframeT2, d => d.promedio)

  // seteo de los dominios
  yT2.domain([0, maxyT2])
  xT2.domain(dataframeT2.map(d => d.edad))
  // invocar al render
  renderT2(dataframeT2)
}

// eventos
topSelectT2.on('change', () => {
  frameT2()
})
$( "#ex1-tab-2" ).click(function() {
  //tooltip.style("display", "none")
  tooltipT0.style("display", "none")
});