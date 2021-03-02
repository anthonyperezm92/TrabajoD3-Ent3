// Configuracion de margenes y altura
graf = d3.select('#graf')
ancho_total = grafT0.style('width').slice(0, -2)
alto_total = ancho_total * 9 / 16

graf.style('width', `${ ancho_total }px`)
    .style('height', `${ alto_total }px`)

margins = { top: 20, left: 50, right: 15, bottom: 120 }

ancho = ancho_total - margins.left - margins.right
alto  = alto_total - margins.top - margins.bottom

// configuracion de svg
svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)

g = svg.append('g')
        .attr('transform', `translate(${ margins.left }, ${ margins.top })`)
        .attr('width', ancho + 'px')
        .attr('height', alto + 'px')
// configuracion de escalas
y = d3.scaleLinear()
          .range([alto, 0])

x = d3.scaleBand()
      .range([0, ancho])
      .paddingInner(0.1)
      .paddingOuter(0.3)

color = d3.scaleOrdinal()
          .range(d3.schemeAccent)
// Se agrega los ejes
xAxisGroup = g.append('g')
              .attr('transform', `translate(0, ${ alto })`)
              .attr('class', 'eje')
yAxisGroup = g.append('g')
              .attr('class', 'eje')

dataArray = []

// Selector de top
topSelect = d3.select('#seltop')

metrica = 'promedio'
ascendente = false
// se crea el tooltip de ayuda
var tooltip = d3.select("body").append("div").attr("class", "toolTip");
// render (update o dibujo)
function render(data) {
// bind de los datos
  bars = g.selectAll('rect')
            .data(data, d => d.Pais)
// dibujo y transicion de las barras
  bars.enter()
      .append('rect')
        .style('width', '0px')
        .style('height', '0px')
        .style('y', `${y(0)}px`)
        .style('fill', '#000')        
      .merge(bars)
        .transition()
        .duration(2000)
          .style('x', d => x(d.Pais) + 'px')
          .style('y', d => (y(d[metrica])) + 'px')
          .style('height', d => (alto - y(d[metrica])) + 'px')
          .style('fill', d => color(d.Pais))
          .style('width', d => `${x.bandwidth()}px`)

// evento para msotrar el tooltip
          g.selectAll('rect')
            .on("mousemove", function(event,d){
              tooltip
                .style("left", event.pageX - 50 + "px")
                .style("top", event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html((d.Pais) + "<br>" + "Promedio Suicidios: " + (d.promedio));
          })
  // transicion de salida
  bars.exit()
      .transition()
      .duration(2000)
        .style('height', '0px')
        .style('y', d => `${y(0)}px`)
        .style('fill', '#000000')
      .remove()

// efectos de transicion de los ejes
  yAxisCall = d3.axisLeft(y)
                .ticks(10)
                .tickFormat(d => d + '')
  yAxisGroup.transition()
            .duration(2000)
            .call(yAxisCall)

  xAxisCall = d3.axisBottom(x)
  xAxisGroup.transition()
            .duration(2000)
            .call(xAxisCall)
            .selectAll('text')
            .attr('x', '-8px')
            .attr('y', '-5px')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-60)')
}

//  Carga de datos desde csv
d3.csv('promedio_suma.csv')
.then(function(data) {
  data.forEach(d => {
    d.promedio = +d.promedio
  })
debugger;
  dataArray = data
// agregar domio de color
  color.domain(data.map(d => d.Pais))

    // llenar option del select
  var opt = [{valor: '5' , texto : 'TOP 5'},{valor: '10' , texto : 'TOP 10'},{valor: '20' , texto : 'TOP 20'}]

 opt.forEach(d => {
    console.log(d)
    topSelect.append('option')
                .attr('value', d.valor)
                .text(d.texto)
  })

  ///  Despliegue
  frame()
})
.catch(e => {
  console.log('No se tuvo acceso al archivo ' + e.message)
})

function frame() {
  dataframe = dataArray
  // ordenar las barras top
  dataframe.sort((a, b) => {
    return  d3.descending(a.promedio, b.promedio)
  })

// se obtiene el valor seleccionado
  var num =   0 + topSelect.node().value

// filtrar los datos por el filtro seleccionado
  dataframe = dataArray.slice(0, num)


  // Calcular la altura maxima del eje
  maxy = d3.max(dataframe, d => d.promedio)
  // seteo de los dominios
  y.domain([0, maxy])
  x.domain(dataframe.map(d => d.Pais))
// invocar al render
  render(dataframe)
}
// eventos
topSelect.on('change', () => {
  frame()
})
$( "#ex1-tab-1" ).click(function() {
  tooltipT2.style("display", "none")
  tooltipT0.style("display", "none")
});