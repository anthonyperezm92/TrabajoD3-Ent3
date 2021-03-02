// Configuracion de margenes y altura
grafT0 = d3.select('#grafT0')
debugger;
anchoT0_totalT0 = +  graf.style('width').slice(0, -2)
altoT0_totalT0 = anchoT0_totalT0 * 9 / 16

grafT0.style('width', `${ anchoT0_totalT0 }px`)
    .style('height', `${ altoT0_totalT0 }px`)

marginsT0 = { top: 180, left: 50, right: 250, bottom: 50 }

anchoT0 = anchoT0_totalT0 - marginsT0.left - marginsT0.right
altoT0  = altoT0_totalT0 - marginsT0.top - marginsT0.bottom

// configuracion de svg
svgT0 = grafT0.append('svg')
          .style('width', `${ anchoT0_totalT0 }px`)
          .style('height', `${ altoT0_totalT0 }px`)

gT0 = svgT0.append('g')
        .attr('transform', `translate(${ marginsT0.left }, ${ marginsT0.top })`)
        .attr('width', anchoT0 + 'px')
        .attr('height', altoT0 + 'px')

// configuracion de escalas
yT0 = d3.scaleLinear()
          .range([altoT0, 0])

xT0 = d3.scaleBand()
      .range([0, anchoT0])
      .paddingInner(0.1)
      .paddingOuter(0.3)

colorT0 = d3.scaleOrdinal()
          .range(d3.schemeAccent)

// Se agrega los ejes
xAxisGroupT0 = gT0.append('g')
              .attr('transform', `translate(0, ${ altoT0 })`)
              .attr('class', 'eje')
yAxisGroupT0 = gT0.append('g')
              .attr('class', 'eje')

// Agregar titulo

titulo = gT0.append('text')
          .attr('x', `${anchoT0 / 2}px`)
          .attr('y', '-120px')
          .attr('text-anchor', 'middle')
          .text('Promedio Suicidios por edad')
          .attr('class', 'titulo-grafica')

dataArrayT0 = []

dataframePaisT0 = []

var interval

// Selector de top
topSelectT0 = d3.select('#seltopT0')
metricaT0 = 'promedio'

// se crea el tooltip de ayuda
var tooltipT0 = d3.select("body").append("div").attr("class", "toolTip");

// barra slider
slider     = d3.select('#slider');
years = []
iyear = 0

// render (update o dibujo)
function renderT0(dataT0) {
  // bind de los datos
  barsT0 = gT0.selectAll('rect.bara')
            .data(dataT0, d => d.edad)
// dibujo y transicion de las barras
  barsT0.enter()
      .append('rect')
        .attr('class', 'bara')
        .style('width', '0px')
        .style('height', '0px')
        .style('y', `${yT0(0)}px`)
        .style('fill', '#000')        
      .merge(barsT0)
        .transition()
        .duration(1000)
          .style('x', d => xT0(d.edad) + 'px')
          .style('y', d => (yT0(d[metricaT0])) + 'px')
          .style('height', d => (altoT0 - yT0(d[metricaT0])) + 'px')
          .style('fill', d => colorT0(d.edad))
          .style('width', d => `${xT0.bandwidth()}px`)

    // evento para msotrar el tooltip
          gT0.selectAll('rect.bara')
            .on("mousemove", function(event,d){
              debugger;
              console.log(d);
              tooltipT0
                .style("left", event.pageX - 50 + "px")
                .style("top", event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html((d.Pais) + "<br>" +(d.edad) + "<br>" + "Promedio Suicidios: " + (d.promedio));
          })

  // transicion de salida
  barsT0.exit()
      .transition()
      .duration(2000)
        .style('height', '0px')
        .style('y', d => `${yT0(0)}px`)
        .style('fill', '#000000')
      .remove()

// efectos de transicion de los ejes
  yAxisCallT0 = d3.axisLeft(yT0)
                .ticks(10)
                .tickFormat(d => d + '')
  yAxisGroupT0.transition()
            .duration(1000)
            .call(yAxisCallT0)

  xAxisCallT0 = d3.axisBottom(xT0)
                .tickFormat(d => '') // ocultar 
  xAxisGroupT0.transition()
            .duration(1000)
            .call(xAxisCallT0)
}

//  Carga de datos desde csv
d3.csv('linea.csv')
.then(function(dataT0) {
  dataT0.forEach(d => {
    d.promedio = +d.promedio
  })

  dataArrayT0 = dataT0
// agregar dominio de color
  colorT0.domain(dataT0.map(d => d.edad))
  var l = dataT0.map(d => d.Pais);
  
  // llenar option del select
  result = l.filter((item,index)=>{
    return l.indexOf(item) === index;
  })

  result.forEach(d => {
    topSelectT0.append('option')
                .attr('value', d)
                .text(d)
  })

  // Leyenda
gT0.append('rect')
.attr('x', anchoT0 - 0)
.attr('y', altoT0 - 460)
.attr('width', 230)
.attr('height', 250)
.attr('stroke', 'black')
.attr('fill', '#dedede')

colorT0.domain().forEach((d, i) => {
  gT0.append('rect')
      .attr('x', anchoT0 + 20)
      .attr('y', altoT0 - 430 + i*35)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', colorT0(d))

      gT0.append('text')
      .attr('x', anchoT0 + 60)
      .attr('y', altoT0 - 415 + i*35)
      .attr('fill', 'black')
      .text(d[0].toUpperCase() + d.slice(1))
  })

  //  Despliegue
  frameT0()
  // iniciar slider automatico
  interval = d3.interval(() => delta(1), 3000)
  topSelectT0.dispatch('change')
})
.catch(e => {
  console.log('No se tuvo acceso al archivo ' + e.message)
})

function frameT0() {

  dataframeT0 = dataframePaisT0  

  year = years[iyear]

  dataframeT0 = d3.filter(dataframeT0, d => d.anio == year)

  // actualizar titulo
  titulo.text('Promedio suicidios por edad en '+topSelectT0.node().value+ ' en el año ' + year)

  slider.node().value = iyear

  // Calcular la altura maxima del eje
  maxyT0 = d3.max(dataframeT0, d => d.promedio)

  // seteo de los dominios
  yT0.domain([0, maxyT0])
  xT0.domain(dataframeT0.map(d => d.edad))
  // invocar al render
  renderT0(dataframeT0)
}

function delta(d) {
  iyear += d
  if (iyear < 0) iyear = years.length-1
  if (iyear > years.length-1) iyear = 0
  frameT0()
}

// eventos
topSelectT0.on('change', () => {
  // se obtiene el valor seleccionado
  var ps =   topSelectT0.node().value  
// filtrar los datos por el filtro seleccionado
dataframePaisT0 = d3.filter(dataArrayT0, d => (d.Pais == ps))

var hr = dataframePaisT0.map(d => d.anio);

// llenar lista de años
years = hr.filter((item,index)=>{
    return hr.indexOf(item) === index;
  })

  // setear valor maximo y minimo
slider.attr('min', 0)
.attr('max', years.length - 1)

iyear = 0
slider.node().value = 0

  frameT0()
})

$( "#ex1-tab-0" ).click(function() {
  //tooltip.style("display", "none")
  tooltipT2.style("display", "none")
});

slider.on('input', () => {
  iyear = +slider.node().value
  frameT0()
});