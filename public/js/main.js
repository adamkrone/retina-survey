// Survey Object
var Survey = {};

// Image Source Files
Survey.img = {};

Survey.img.one = {};
Survey.img.one.retina = "images/img1-retina.jpg";
Survey.img.one.full = "images/img1-full.jpg";

Survey.img.two = {};
Survey.img.two.retina = "images/img2-retina.jpg";
Survey.img.two.full = "images/img2-full.jpg";

Survey.img.three = {};
Survey.img.three.retina = "images/img3-retina.jpg";
Survey.img.three.full = "images/img3-full.jpg";

Survey.img.four = {};
Survey.img.four.retina = "images/img4-retina.jpg";
Survey.img.four.full = "images/img4-full.jpg";

// Survey Data
Survey.data = {};

// Set Random Images
Survey.setRandomImg = function (number) {

	// Random number
	var rand = Math.round(Math.random()),
		other = rand === 0 ? 1 : 0,
		images = ["zero", "one", "two", "three", "four"];

	// Insert random image
	$("#image" + number + " div:eq(" + rand + ")")
		.addClass("retina")
		.css("background", "url(" + Survey.img[images[number]].retina + ") no-repeat center");
	$("#image" + number + " div:eq(" + other + ")")
		.css("background", "url(" + Survey.img[images[number]].full + ") no-repeat center");

};

// Show Results
Survey.showResults = function () {

	var numNonRetina = 0,
		numRetina = 4;

	$.each(Survey.data, function () {

		if (this == "Non-retina") {
			numNonRetina += 1;
		}

	});

	numRetina = numRetina - numNonRetina;

	$("#retina").text("Retina preferred: " + numRetina);
	$("#nonRetina").text("Non-retina Preferred: " + numNonRetina);

};

// Save Survey Data
Survey.saveData = function () {

	$.ajax({
		url: "/survey",
		type: "POST",
		data: Survey.data,
		success: function () {

			$("#results").prepend('<p class="success">Results saved!</p>')

		},
		error: function () {

			$("#results").prepend('<p class="error">Error saving results.');

		}
	});

};

// Get Survey Data
Survey.getData = function () {

	var surveyData,
		totalItems,
		totalRetina = 0,
		totalNonRetina = 0,
		retinaCorrect = 0,
		retinaWrong = 0,
		retina_retinaCorrect = 0,
		retina_retinaWrong = 0,
		nonRetina_retinaCorrect = 0,
		nonRetina_retinaWrong = 0;

	$.ajax({
		url: "/survey",
		type: "GET",
		async: false,
		success: function (data) {

			surveyData = data;

		}
	});

	totalItems = surveyData.length * 4;

	$.each(surveyData, function () {

		this.image1 === "Retina" ? retinaCorrect += 1: retinaWrong += 1;
		this.image2 === "Retina" ? retinaCorrect += 1: retinaWrong += 1;
		this.image3 === "Retina" ? retinaCorrect += 1: retinaWrong += 1;
		this.image4 === "Retina" ? retinaCorrect += 1: retinaWrong += 1;

		if (this.device === "Retina") {

			totalRetina += 1;

			this.image1 === "Retina" ? retina_retinaCorrect += 1: retina_retinaWrong += 1;
			this.image2 === "Retina" ? retina_retinaCorrect += 1: retina_retinaWrong += 1;
			this.image3 === "Retina" ? retina_retinaCorrect += 1: retina_retinaWrong += 1;
			this.image4 === "Retina" ? retina_retinaCorrect += 1: retina_retinaWrong += 1;

		} else {

			totalNonRetina += 1;

			this.image1 === "Retina" ? nonRetina_retinaCorrect += 1: nonRetina_retinaWrong += 1;
			this.image2 === "Retina" ? nonRetina_retinaCorrect += 1: nonRetina_retinaWrong += 1;
			this.image3 === "Retina" ? nonRetina_retinaCorrect += 1: nonRetina_retinaWrong += 1;
			this.image4 === "Retina" ? nonRetina_retinaCorrect += 1: nonRetina_retinaWrong += 1;

		}

	});

	totalRetina *= 4;
	totalNonRetina *= 4;

	retinaCorrect = ((retinaCorrect / totalItems) * 100).toFixed(2) + "%";
	retinaWrong = ((retinaWrong / totalItems) * 100).toFixed(2) + "%";

	retina_retinaCorrect = ((retina_retinaCorrect / totalRetina) * 100).toFixed(2) + "%";
	retina_retinaWrong = ((retina_retinaWrong / totalRetina) * 100).toFixed(2) + "%";

	nonRetina_retinaCorrect = ((nonRetina_retinaCorrect / totalNonRetina).toFixed(2) * 100) + "%";
	nonRetina_retinaWrong = ((nonRetina_retinaWrong / totalNonRetina).toFixed(2) * 100) + "%";

	$("#retinaSelected").text("Retina Preferred: " + retinaCorrect);
	$("#nonRetinaSelected").text("Non-retina Preferred: " + retinaWrong);

	$("#retinaSelectedRetina").text("Retina Preferred: " + retina_retinaCorrect);
	$("#nonRetinaSelectedRetina").text("Non-retina Preferred: " + retina_retinaWrong);

	$("#retinaSelectedNonRetina").text("Retina Preferred: " + nonRetina_retinaCorrect);
	$("#nonRetinaSelectedNonRetina").text("Non-retina Preferred: " + nonRetina_retinaWrong);

}

// Show first panel
$("#device-select").show();

for (var i = 1; i < 5; i++) {

	Survey.setRandomImg(i);

}

/**
 * Event Binding
 */

$("#device-select button").click(function () {

	// Save device info
	Survey.data.device = $(this).text();

	$(this).parent().hide();

	$("#image1").show();

});

$(".image").click(function () {

	var imgNum = parseInt($(this).parent().attr("id").substr(-1), 10),
		isRetina = $(this).hasClass("retina"),
		imgType = isRetina ? "Retina" : "Non-retina";

	switch (imgNum) {
	case 1:
		Survey.data.image1 = imgType;
		$(".survey-panel").hide();
		$("#image2").show();
		break;
	case 2:
		Survey.data.image2 = imgType;
		$(".survey-panel").hide();
		$("#image3").show();
		break;
	case 3:
		Survey.data.image3 = imgType;
		$(".survey-panel").hide();
		$("#image4").show();
		break;
	case 4:
		Survey.data.image4 = imgType;
		$(".survey-panel").hide();
		$("#results").show();
		Survey.saveData();
		Survey.getData();
		Survey.showResults();
		break;
	}

});