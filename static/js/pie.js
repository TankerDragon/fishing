window.onload = function () {
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: "Total Amout",
      horizontalAlign: "right",
    },
    data: [
      {
        theme: "dark2",
        type: "doughnut",
        startAngle: 60,
        innerRadius: 60,
        indexLabelFontSize: 17,
        indexLabel: "{label} - #percent%",
        toolTipContent: "<b>{label}:</b> {y} (#percent%)",
        dataPoints: [
          { y: 0.2, label: "Lane Budged" },
          { y: 0.7, label: "Driver Budged" },
          { y: 0.1, label: "Recovery Budged" },
        ],
      },
    ],
  });
  chart.render();
};
