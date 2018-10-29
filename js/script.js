$( function () {
    $.ajax({
      dataType: "text",
      url: "https://data.irozhlas.cz/roboti-povolani/data/jobs_names.csv",
      success: function(data) {processData(data.split("\n"));}
    });

    function processData(jobs) {
        loadData("Kalič");

        jobs.sort().forEach(function(entry) {
            $("#selectMenu").append("<option>" + entry + "</option>");
        })

        $("#selectMenu").select2();

        $("#select2-selectMenu-container").text("Kalič");

        $("#selectMenu").change(function(choice) {
            loadData($( "select option:selected" ).text());
        });
    }

    function loadData(job) {
        var slug = bezdiak(job).toLowerCase().replace(/ /g,"_").replace(/–/g,"-").replace(/"/g,"");
        console.log(slug);
        $.getJSON("https://data.irozhlas.cz/roboti-povolani/jobs_data/" + slug + ".json", function(data) {
            drawChartGeneral(data.obecne);
            drawChartSoft(data.mekke);
            drawRoboBar(data, job);
        });
    }

    function drawChartGeneral(data) {
        var categories = ["Počítačová způsobilost", "Numerická způsobilost", "Jazyková způsobilost v dalším cizím jazyce", 
                "Jazyková způsobilost v češtině", "Ekonomické povědomí", "Právní povědomí", "Jazyková způsobilost v angličtině",
                "Způsobilost k řízení osobního automobilu"];
        var values = [];
        categories.forEach(function(category) {
            if (data[category]) {
                values.push(data[category]);
            } else {
                values.push(0.499);
            }
        })

        var chart = Highcharts.chart('graf1', {

            chart: {
                polar: true,
                type: 'area'
            },

            title: {
                text: 'Obecné dovednosti',
            },

            pane: {
                size: '80%'
            },

            xAxis: {
                categories: categories,
                tickmarkPlacement: 'on',
                lineWidth: 0
            },

            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                tickInterval: 1,
                min: 0,
                max: 3,
                labels: {
                    enabled: false
                }
            },

            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
            },

            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical',
                enabled: false
            },

            credits: {
                enabled: false
            },

            series: [{
                name: 'Úroveň kvalifikace (1-3)',
                data: values,
                pointPlacement: 'on'
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        pane: {
                            size: '50%'
                        },
                    }
                }]
            }

        });
    }

    function drawChartSoft(data) {
        var categories = ["Celoživotní učení", "Zvládání zátěže", "Samostatnost", "Objevování a orientace v informacích", 
        "Kooperace (spolupráce)", "Uspokojování zákaznických potřeb", "Kreativita",
        "Aktivní přístup", "Flexibilita", "Plánování a organizování práce", 
        "Vedení lidí (leadership)", "Výkonnost", "Ovlivňování ostatních", 
        "Efektivní komunikace", "Řešení problémů"];
        var values = [];
        categories.forEach(function(category) {
            if (data[category]) {
                values.push(data[category]);
            } else {
                values.push(0.499);
            }
        })
        var chart = Highcharts.chart('graf2', {

            chart: {
                polar: true,
                type: 'area'
            },

            title: {
                text: 'Měkké kompetence',
            },

            pane: {
                size: '80%'
            },

            xAxis: {
                categories: categories,
                tickmarkPlacement: 'on',
                lineWidth: 0
            },

            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                tickInterval: 1,
                min: 0,
                max: 5,
                labels: {
                    enabled: false
                }
            },

            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
            },

            legend: {
                enabled: false
            },

            credits: {
                enabled: false
            },

            series: [{
                name: 'Úroveň kvalifikace (1-5)',
                data: values,
                pointPlacement: 'on'
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        pane: {
                            size: '65%'
                        },
                        xAxis: {
                            labels: {
                                style: {
                                    "fontSize": "8px"
                                }
                            }
                        },
                    }
                }]
            }

        });
    }

    function drawRoboBar(data, job) {
        var robotized = ["Počítačová způsobilost", "Numerická způsobilost", "Jazyková způsobilost v dalším cizím jazyce", 
                "Jazyková způsobilost v angličtině", "Způsobilost k řízení osobního automobilu", "Celoživotní učení",
                "Zvládání zátěže", "Kooperace (spolupráce)", "Flexibilita", "Plánování a organizování práce", 
                "Výkonnost"];
        var catGeneral = ["Počítačová způsobilost", "Numerická způsobilost", "Jazyková způsobilost v dalším cizím jazyce", 
                "Jazyková způsobilost v češtině", "Ekonomické povědomí", "Právní povědomí", "Jazyková způsobilost v angličtině",
                "Způsobilost k řízení osobního automobilu"];
        var catSoft = ["Celoživotní učení", "Zvládání zátěže", "Samostatnost", "Objevování a orientace v informacích", 
        "Kooperace (spolupráce)", "Uspokojování zákaznických potřeb", "Kreativita",
        "Aktivní přístup", "Flexibilita", "Plánování a organizování práce", 
        "Vedení lidí (leadership)", "Výkonnost", "Ovlivňování ostatních", 
        "Efektivní komunikace", "Řešení problémů"];
        var values = {};
        for (var attrname in data.obecne) { values[attrname] = data.obecne[attrname]; }
        for (var attrname in data.mekke) { values[attrname] = data.mekke[attrname]; }

        // total: sum of values for each competence, partial: sum of values computerized 

        var genTotal = 0;
        var genRobo = 0;
        var affected = [];

        catGeneral.forEach(function(category) {
            if (data.obecne[category]) {
                genTotal += data.obecne[category];
                if ($.inArray(category, robotized) !== -1) {
                    genRobo += data.obecne[category];
                    affected.push(category);
                }
            }
        });
        
        catSoft.forEach(function(category) {
            if (data.mekke[category]) {
                genTotal += data.mekke[category]/5*3;
                if ($.inArray(category, robotized) !== -1) {
                    genRobo += data.mekke[category]/5*3;
                    affected.push(category);
                }
            }
        });
        
        genTotal = parseInt(genTotal);
        genRobo = parseInt(genRobo);

        var ratio = parseInt(genRobo/genTotal*100)

        var chart = Highcharts.chart('grafBar', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Roboti zastoupí povolání <b>' + job + "</b> v " + ratio + " % kompetencí"
            },
            xAxis: {
                categories: ['Robotizace'],
                labels: {
                    enabled: false
                },
            },
            yAxis: {
                min: 0,
                title: {
                    enabled: false
                }
            },
            tooltip: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    stacking: 'percent'
                }
            },
            series: [{
                name: 'Nerobotizováno',
                data: [genTotal-genRobo]
            },{
                name: 'Robotizováno',
                data: [genRobo]
            }],
            credits: {
                enabled: false
            }
        });
        affected_str = "";
        affected.forEach(function(competence) {
            affected_str += competence.toLowerCase() + ", "
        });
        $("#result").text("Roboti zastoupí vybrané povolání v těchto oblastech: " + affected_str.replace(/, $/,"."));
    }

    function bezdiak(text) {
        var sdiak = "áäčďéěíĺľňóô öŕšťúů üýřžÁÄČĎÉĚÍĹĽŇÓÔ ÖŔŠŤÚŮ ÜÝŘŽ";
        var bdiak = "aacdeeillnoo orstuu uyrzAACDEEILLNOO ORSTUU UYRZ";
        tx = "";
        for (p = 0; p < text.length; p++) {
            if (sdiak.indexOf(text.charAt(p)) != -1) {
                tx += bdiak.charAt(sdiak.indexOf(text.charAt(p)));
            }
            else { 
                tx += text.charAt(p);
            }
        }
        return tx
    }
});