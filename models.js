var svg = d3.select('svg');

var atom_x = 250;
var atom_y = 250;
var atom_r = 100;

var electron_r = 8;

var offset = 0.35;
var refreshIntervalId;
var e_offset = 20;

//need to better center the electron orbit ellipses around these nucleus coordinates
var nucleus_x = atom_x; 
var nucleus_y = atom_y; 
var nucleus_r = 20;

function getRandomOffset() {
  return (Math.random() * 2 - 1);
}

// Create data array containing initial coordinates for schrodinger electron clouds.
var electrons_schrodinger_db = [
  {
  	cx: nucleus_x,
    cy: nucleus_y,
    r: 40,
    class: 'electron-schrodinger',
    opacity: 0.8
  },
  {
  	cx: nucleus_x,
    cy: nucleus_y,
    r: 60,
    class: 'electron-schrodinger',
    opacity: 0.6
  },
  {
  	cx: nucleus_x,
    cy: nucleus_y,
    r: 80,
    class: 'electron-schrodinger',
    opacity: 0.4
  },
  {
  	cx: nucleus_x,
    cy: nucleus_y,
    r: 100,
    class: 'electron-schrodinger',
    opacity: 0.2
  }
];

// Create data array containing initial coordinates for electrons.
var electrons_db = [
  {
  	cx: atom_x + atom_r - e_offset,
    cy: atom_y,
    r: electron_r,
    fill: 'red',
    opacity: 0.0,
    class: 'electron'
  },
  {
  	cx: atom_x,
    cy: atom_y + atom_r - e_offset,
    r: electron_r,
    fill: 'red',
    opacity: 0.0,
    class: 'electron'
  },
  {
  	cx: atom_x - atom_r + e_offset,
    cy: atom_y,
    r: electron_r,
    fill: 'red',
    opacity: 0.0,
    class: 'electron'
  },
  {
  	cx: atom_x,
    cy: atom_y - atom_r + e_offset,
    r: electron_r,
    fill: 'red',
    opacity: 0.0,
    class: 'electron'
  }
];

//create data for rutherford electron orbits
//These angles and translations could be better programmatically done
var electron_orbits_rutherford_db = [
  {
  	cx: atom_x,
    cy: atom_y,
    rx: atom_r,
    ry: atom_r / 10,
    class: 'electron-orbit',
    angle: 10,
    translate_x: 45,
    translate_y:-30
  },
  {
  	cx: atom_x,
    cy: atom_y,
    rx: atom_r,
    ry: atom_r / 10,
    class: 'electron-orbit',
    angle: 80,
    translate_x: 445,
    translate_y:-40
  },
  {
  	cx: atom_x,
    cy: atom_y,
    rx: atom_r,
    ry: atom_r / 10,
    class: 'electron-orbit',
    angle: 100,
    translate_x: 530,
    translate_y: 45
  },
  {
  	cx: atom_x,
    cy: atom_y,
    rx: atom_r,
    ry: atom_r / 10,
    class: 'electron-orbit',
    angle: -10,
    translate_x: -40,
    translate_y: 55
  },
];

//create data for atom
var atom = svg.append("circle")
  .attr({
    r: atom_r,
    cx: atom_x,
    cy: atom_y,
    fill: 'blue',
    opacity: 0.5,
    class: 'atom'
});

//create electron_orbits for bohr model
var electron_orbits_bohr_db = [
  {
  	cx: nucleus_x,
    cy: nucleus_y,
    r: 40,
    class: 'electron-orbit-bohr'
  },
  {
  	cx: nucleus_x,
    cy: nucleus_y,
    r: 60,
    class: 'electron-orbit-bohr'
  },
  {
  	cx: nucleus_x,
    cy: nucleus_y,
    r: 80,
    class: 'electron-orbit-bohr'
  },
  {
  	cx: nucleus_x,
    cy: nucleus_y,
    r: 100,
    class: 'electron-orbit-bohr'
  }
];

//initialize electron orbits for rutherford model
var electron_orbits_rutherford = svg.selectAll('.electron-orbit')
	.data(electron_orbits_rutherford_db)
  .enter()
  .append("ellipse")
  .attr({
  	rx: function(d) {
      return d.rx
    },
    ry: function(d) {
      return d.ry
    },
    cx: function(d) {
    	return d.cx
    },
    cy: function(d) {
    	return d.cy
    },
    class: function(d) {
    	return d.class
    },
    transform: function(d) {
    	return "translate(" + d.translate_x + "," + d.translate_y + ") rotate(" + d.angle + ")"
    },
    stroke: 'black',
    fill: 'transparent',
    opacity: 0.0
  })
  
//initialize electron orbits for bohr model
var electron_orbits_bohr = svg.selectAll('.electron-orbit-bohr')
	.data(electron_orbits_bohr_db)
  .enter()
  .append("circle")
  .attr({
  	r: function(d) {
      return d.r
    },
    cx: function(d) {
    	return d.cx
    },
    cy: function(d) {
    	return d.cy
    },
    class: function(d) {
    	return d.class
    },
    stroke: 'black',
    fill: 'transparent',
    opacity: 0.0,
    class: function(d) {
    	return d.class
    }
  })
  
//initialize electrons for schrodinger model
var electrons_schrodinger = svg.selectAll('.electron-schrodinger')
	.data(electrons_schrodinger_db)
  .enter()
  .append("circle")
  .attr({
  	r: function(d) {
      return d.r
    },
    cx: function(d) {
    	return d.cx
    },
    cy: function(d) {
    	return d.cy
    },
    class: function(d) {
    	return d.class
    },
    stroke: 'black',
    fill: 'gray',
    opacity: 0.0,
    class: function(d) {
    	return d.class
    }
  })
  
//initialize nucleus display  
var nucleus = svg.append("g");
	
nucleus.append("circle")
  .attr({
    r: nucleus_r,
    cx: nucleus_x,
    cy: nucleus_y,
    fill: 'blue',
    opacity: 0.0,
    class: 'nucleus'
});

nucleus.append("text")
  .attr({
  	x: nucleus_x - nucleus_r / 3,
    y: nucleus_y + nucleus_r / 2,
    text: "+",
    class: 'nucleus-text',
    opacity: 0.0
  })
  .attr("font-size", "30px")
  .text("+")

//initialize electrons display
var electrons = svg.selectAll(".electron");

var electrons_g = electrons.data(electrons_db)
  .enter()
  .append('g')
  .attr("class", "electron_g")
  
electrons_g.append("circle")
  .attr({
    r: function(d) {
      return d.r
    },
    cx: function(d) {
    	return d.cx
    },
    cy: function(d) {
    	return d.cy
    },
    fill: function(d) {
    	return d.fill
    },
    opacity: function(d) {
    	return d.opacity
    },
    class: function(d) {
    	return d.class
    }
  })

electrons_g.append("text")
  .attr({
  	x: function(d) {
    	return d.cx - 3
    },
    y: function(d) {
   		return d.cy + 5
    },
    text: "-",
    class: "electron-text",
    opacity: 0.0
  })
  .attr("font-size", "25px")
  .text("-")
  

// dalton model display
d3.select("#dalton").on("click", function() {
	clearInterval(refreshIntervalId);
  
  electron_orbits_rutherford
  	.transition()
  	.attr("opacity", 0.0)
    
  electron_orbits_bohr
  	.transition()
  	.attr({
    	opacity: 0.0,
    })
    
  electrons_g.selectAll('.electron')
  	.transition()
  	.attr("opacity", 0.0)
    
  electrons_g.selectAll('.electron-text')
  	.transition()
  	.attr("opacity", 0.0)
    
  electrons_schrodinger 
  	.transition()
  	.attr({
    	opacity: 0.0
    })
    
  nucleus.select(".nucleus")
  	.transition()
    .attr("opacity", 0.0)
    
  nucleus.select(".nucleus-text")
  	.transition()
    .attr("opacity", 0.0)
  
  atom
    //.transition(); // ALL OF OUR TRANSITIONS WILL GO HERE!
    .transition()
    .attr("opacity", 0.5) // New Opacity
});

//thompson model display
d3.select("#thompson").on("click", function() {
	clearInterval(refreshIntervalId);
	
	electron_orbits_rutherford
  	.transition()
  	.attr("opacity", 0.0)
    
  electron_orbits_bohr
  	.transition()
  	.attr({
    	opacity: 0.0,
    })
    
  electrons_g.selectAll('.electron')
  	.transition()
  	.attr("opacity", 1.0)
    
  electrons_g.selectAll('.electron-text')
  	.transition()
  	.attr("opacity", 1.0)
    
  nucleus.select(".nucleus")
  	.transition()
    .attr("opacity", 0.0)
    
  nucleus.select(".nucleus-text")
  	.transition()
    .attr("opacity", 0.0)
    
  atom
    .transition()
    .attr("cx", atom_x)
    .attr("cy", atom_y)
    .attr("opacity", 0.5)
    
  // reinitialize electrons to avoid drift in their coordinates
  electrons_g
    .attr("cx", function(d, i) {
    	return electrons_db[i].cx;
  	})
   	.attr("cy", function(d, i) {
    	return electrons_db[i].cy;
  	})
    
  electrons_schrodinger 
  	.transition()
  	.attr({
    	opacity: 0.0
    })

  // Set the interval
  refreshIntervalId = setInterval(() => {
    // Update the data bound to the circles.
    electrons_g
    	.attr({
      	transform: function(d, i) {
        	return "translate(" + getRandomOffset() + "," + getRandomOffset() + ")"
        }
      })
  }, 50)
});

//rutherford model display
d3.select("#rutherford").on("click", function() {
	clearInterval(refreshIntervalId);

	atom
  	.transition()
    .attr("opacity", 0.0)
    
  electron_orbits_rutherford
  	.transition()
  	.attr({
    	opacity: 1.0
    })
    
  electron_orbits_bohr
  	.transition()
  	.attr({
    	opacity: 0.0,
    })
    
  electrons_g.selectAll('.electron')
  	.transition()
  	.attr("opacity", 0.5)
    
  electrons_g.selectAll('.electron-text')
  	.transition()
  	.attr("opacity", 1.0)
    
  nucleus.select(".nucleus")
  	.transition()
    .attr("opacity", 1.0)
    
  nucleus.select(".nucleus-text")
  	.transition()
    .attr("opacity", 1.0)
    
 	// reinitialize electrons to avoid drift in their coordinates
  electrons_g
    .attr("cx", function(d, i) {
    	return electrons_db[i].cx;
  	})
   	.attr("cy", function(d, i) {
    	return electrons_db[i].cy;
  	})
    
  electrons_schrodinger 
  	.transition()
  	.attr({
    	opacity: 0.0
    })
    
  // Set the interval
  refreshIntervalId = setInterval(() => {
    // Update the data bound to the circles.
    electrons_g
    	.attr({
      	transform: function(d, i) {
        	return "translate(" + getRandomOffset() + "," + getRandomOffset() + ")"
        }
      })
  }, 50)
});

d3.select("#bohr").on("click", function() {
	clearInterval(refreshIntervalId);

	atom
  	.transition()
    .attr("opacity", 0.0)
    
  electron_orbits_rutherford
  	.transition()
  	.attr({
    	opacity: 0.0
    })
    
  electron_orbits_bohr
  	.transition()
  	.attr({
    	opacity: 1.0,
    })
    
  electrons_g.selectAll('.electron')
  	.transition()
  	.attr("opacity", 0.5)
    
  electrons_g.selectAll('.electron-text')
  	.transition()
  	.attr("opacity", 1.0)
    
  nucleus.select(".nucleus")
  	.transition()
    .attr("opacity", 0.5)
    
  nucleus.select(".nucleus-text")
  	.transition()
    .attr("opacity", 1.0)
    
  // reinitialize electrons to avoid drift in their coordinates
  electrons_g
    .attr("cx", function(d, i) {
    	return electrons_db[i].cx;
  	})
   	.attr("cy", function(d, i) {
    	return electrons_db[i].cy;
  	})
    
  electrons_schrodinger 
  	.transition()
  	.attr({
    	opacity: 0.0
    })
    
  // Set the interval
  refreshIntervalId = setInterval(() => {
    // Update the data bound to the circles.
    electrons_g
    	.attr({
      	transform: function(d, i) {
        	return "translate(" + getRandomOffset() + "," + getRandomOffset() + ")"
        }
      })
  	}, 50)
});

d3.select("#schrodinger").on("click", function() {
	clearInterval(refreshIntervalId);

	atom
  	.transition()
    .attr("opacity", 0.0)
    
  electron_orbits_rutherford
  	.transition()
  	.attr({
    	opacity: 0.0
    })
    
  electron_orbits_bohr
  	.transition()
  	.attr({
    	opacity: 0.0,
    })
    
  electrons_g.selectAll('.electron')
  	.transition()
  	.attr("opacity", 0.0)
    
  electrons_g.selectAll('.electron-text')
  	.transition()
  	.attr("opacity", 0.0)
    
  nucleus.select(".nucleus")
  	.transition()
    .attr("opacity", 0.9)
    
  nucleus.select(".nucleus-text")
  	.transition()
    .attr("opacity", 1.0)
    
	electrons_schrodinger
  	.transition()
  	.attr({
    	opacity: function(d, i) {
      	return electrons_schrodinger_db[i].opacity
      }
    })
});

// start with dalton model displayed
jQuery("#dalton").click()