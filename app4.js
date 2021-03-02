// Gráficas de lineas cambiante
//

// contenedor principal y margenes
graf = d3.select('#grafT4')
ancho_total = graf.style('width').slice(0, -2)
alto_total  = ancho_total * 0.5625
margins = {
  top: 120,
  left: 50,
  right: 50,
  bottom: 50
}
ancho = ancho_total - margins.left - margins.right
alto  = alto_total - margins.top - margins.bottom

// valores iniciales
edades = ['05-14 anios','15-24 anios','25-34 anios','35-54 anios','55-74 anios','75+ anios']
colores4 = ['#0000ff', '#ff00ff', '#008000','#800000', '#ff0000','#008080']
iedad = 0
var pais4 
var data_ori = []
var data = []
parser = d3.timeParse(d3.timeParse('%Y'))
var interval4

// Selector de de paises
topSelectT4 = d3.select('#seltopT4')

// Area del grafico
svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)

// Contenedor interno
g = svg.append('g')
        .attr('transform', `translate(${ margins.left }, ${ margins.top })`)
        .attr('width', ancho + 'px')
        .attr('height', alto + 'px')

// area de las lineas
svg.append("rect")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .attr('fill', '#ffffff')
        .attr('fill-opacity', 0.25)
        .attr("width", ancho)
        .attr("height", alto)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", e => mousemove(e))

// tooltip en los puntos
focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none")

focus.append("line")
        .attr("class", "y-hover-line hover-line")
focus.append("line")
        .attr("class", "x-hover-line hover-line")

focus.append("circle")
        .attr("r", 7.5)

focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

// Escaladores linea de tiempo X / lineal eje Y, y coleres
x = d3.scaleTime().range([0, ancho])
y = d3.scaleLinear().range([alto, 0])
color = d3.scaleOrdinal()
          .domain(edades)
          .range(colores4)

// Pintado de ejes
xAxisCall = d3.axisBottom()
xAxis = g.append('g')
          .attr('class', 'ejes')
          .attr('transform', `translate(0, ${alto})`)
yAxisCall = d3.axisLeft()
yAxis = g.append('g')
          .attr('class', 'ejes')

// Titulo de cabecera del grafico
titulo4 = g.append('text')
          .attr('x', `${ancho / 2}px`)
          .attr('y', '-60px')
          .attr('text-anchor', 'middle')
          .text('Promedio Suicidios por edad')
          .attr('class', 'titulo-grafica')

// Generador de líneas
lineaGen = d3.line()
              .x(d => x(d.anio))
              .y(d => y(d.promedio))
linea = g.append('path')

// funcion que carga los datos del csv
function load() {
  d3.csv('linea2.csv').then(data => {
    data.forEach(d => {
        d.promedio = +d.promedio
        d.anioT = d.anio
        d.anio = parser(d.anio)        
    })

     // llenar option del select con los paises
    var l = data.map(d => d.Pais);   
    result = l.filter((item,index)=>{
        return l.indexOf(item) === index;
    })
    result.forEach(d => {
        topSelectT4.append('option')
                    .attr('value', d)
                    .text(d)
    })
    // almacenar daros leidos 
    this.data_ori = data
    
    // Llamar a funcion de pintado e intervalo de tiempo
    frameT4() 
    interval4 = d3.interval(() => delta4(1), 3000)
    topSelectT4.dispatch('change')
  })
}


function frameT4(symbol) {
   
    // recalcular dominios de ejes
    x.domain(d3.extent(data, d => d.anio))

    y.domain([
      d3.min(data, d => d.promedio) * 0.95,
      d3.max(data, d => d.promedio) * 1.05
    ])
    
    // actualizar titulo 
    symbol = edades[iedad]
    titulo4.text('Evolucion de suicidios por año en '+pais4+ ' edad ' + symbol)

    // Transicion actualizar ejes
    xAxis.transition()
          .duration(500)
          .call(xAxisCall.scale(x))
    yAxis.transition()
          .duration(500)
          .call(yAxisCall.scale(y))

    // Llamar a funcion actualizar lineas
    render(data, symbol)
}

// funcion actualizar lineas
function render(data, symbol) {
  linea.attr('fill', 'none')
        .attr('stroke-width', 3)
        .transition()
        .duration(500)
        .attr('stroke', color(symbol))
        .attr('d', lineaGen(data))
}



// funcion que pinta tooltip
function mousemove(e) {
 
  x0 = x.invert(d3.pointer(e)[0])

  bisectDate = d3.bisector((d) => d.anio).left
  i = bisectDate(data, x0, 1)
  d0 = data[i - 1],
  d1 = data[i],
  d = x0 - d0.anio > d1.anio - x0 ? d1 : d0;

  focus.attr("transform", "translate(" + x(d.anio) + "," + y(d.promedio) + ")");
  focus.select("text").text(function() { return 'Promedio de suicidios en '+d.anioT+' : '+ d.promedio; });
  focus.select(".x-hover-line").attr("x2", -x(d.anio))
  focus.select(".y-hover-line").attr("y2", alto - y(d.promedio))
}

// funcion actualizar rango edad automatico por interval
function delta4(d) {
    iedad += d
    if (iedad < 0) iedad = edades.length-1
    if (iedad > edades.length-1) iedad = 0
    symbol = edades[iedad]
    data = d3.filter(data_ori, d => d.Pais == pais4)
   this.data = d3.filter(data, d => d.edad == symbol)
    frameT4()
  }
// Evento cange del selector de pais
topSelectT4.on('change', () => {
    // se obtiene el valor seleccionado
    pais4 =   topSelectT4.node().value  
    iedad = 0;
    symbol = edades[iedad]
  // filtrar los datos por el filtro seleccionado
  data = d3.filter(data_ori, d => d.Pais == pais4)
  this.data = d3.filter(data, d => d.edad == symbol)  
 
    frameT4()
  })

  // Llamar a funcion carfar datos
  load()

  $( "#ex1-tab-4" ).click(function() {
    tooltipT2.style("display", "none")
    tooltipT0.style("display", "none")
  });