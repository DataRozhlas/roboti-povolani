$( function () {
    $.ajax({
      dataType: "text",
      url: "https://data.irozhlas.cz/roboti-povolani/data/jobs_names.csv",
      success: function(data) {processData(data.split("\n"));}
    });

    function processData(jobs) {
        loadData("Kalič");

        $("#jobsearch").click(function() {
            $(this).val("");
        });

        $("#jobsearch").autocomplete({
            source: jobs,
            minLength: 3
        });

        
        // autocomplete load
        var shownJob;
        $(".ui-menu").click(function () {
            if (shownJob != $("#jobsearch").val()) {
                loadData($("#jobsearch").val(), 1);
            }
        });
        $("#jobsearch").on("keydown", function (event) {
            if (event.which === 13) {
                $(".ui-menu").hide();
                if (shownJob != $("#jobsearch").val()) {
                    loadData($("#jobsearch").val(), 1);
                }
            }
        });

        var timeoutID1 = 0;
        $("#jobsearch").on("input", function () {
            window.clearTimeout(timeoutID1);
            timeoutID1 = window.setTimeout( function () {
                if (shownJob != $("#jobsearch").val()) {
                    loadData($("#jobsearch").val(), 1);
                }
            }, 500);
        });
    }

    function loadData(job) {
        var slug = bezdiak(job).toLowerCase().replace(/ /g,"_").replace(/,|"/g,"");
        $.getJSON("https://data.irozhlas.cz/roboti-povolani/jobs_data/" + slug + ".json", function(data) {
            drawChartGeneral(data.obecne);
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
                values.push(0);
            }
        })
        console.log(data);
        var chart = Highcharts.chart('graf1', {

            chart: {
                polar: true,
                type: 'line'
            },

            title: {
                text: 'Budget vs spending',
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
                min: 0,
                max: 3
            },

            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
            },

            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical',
                enabled: false
            },

            series: [{
                name: 'Allocated Budget',
                data: values,
                pointPlacement: 'on'
            }]

        });
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