function SVGTemplate(file) {

    var
        template;

    this.load = (cb) => {
        var xmlhttp = new XMLHttpRequest();
        if (cb)
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4)
                    if ((xmlhttp.status == 200) || (xmlhttp.status == 0)) {
                        template = xmlhttp.responseText;
                        cb();
                    }
                else cb();
            };
        xmlhttp.open("GET", file, true);
        xmlhttp.send();
    }

    this.getSVG = () => template;

}

function SVG(template) {

    var
        node = document.createElement("div"),
        svg = "no";

    node.innerHTML = template.getSVG();

    this.createNode = (type) => document.createElementNS("http://www.w3.org/2000/svg", type);

    this.copyNode = (node) => {
        var copy = this.createNode(node.tagName);
        copy.setAttribute("style", node.getAttribute("style"));
        copy.setAttribute("width", node.getAttribute("width"));
        copy.setAttribute("height", node.getAttribute("height"));
        copy.setAttribute("x", node.getAttribute("x"));
        copy.setAttribute("y", node.getAttribute("y"));
        return copy;
    }

    this.insertBefore = (node, node2) => node.parentNode.insertBefore(node2, node);

    this.getById = (id) => node.querySelector("#" + id);

    this.setImage = (id, image) => this.getById(id).setAttribute("xlink:href", image);

    this.delete = (id) => {
        var subnode = this.getById(id);
        if (!subnode) subnode = node.querySelector("[inkscape\\:label=\"" + id + "\"]");
        if (subnode) subnode.parentNode.removeChild(subnode);
    }

    this.setAttributeNumber = (node, prop, value) => {
        value = Math.floor(value * 1000) / 1000;
        node.setAttribute(prop, value);
    }

    this.setText = (id, text) => {
        var
            LH = 3.5,
            lines = ("" + text).split("\n"),
            subnode = this.getById(id),
            tspan = subnode.querySelector("tspan"),
            style = tspan.getAttribute("style"),
            height = subnode.offsetHeight,
            x = tspan.getAttribute("x") * 1,
            y = tspan.getAttribute("y") * 1;
        y -= (LH * (lines.length - 1)) / 2;
        subnode.innerHTML = "";
        lines.forEach(line => {
            var span = this.createNode("tspan");
            this.setAttributeNumber(span, "x", x);
            this.setAttributeNumber(span, "y", y);
            span.setAttribute("style", style);
            span.innerHTML = line;
            subnode.appendChild(span);
            y += LH;
        })

    }

    this.download = (filename) => {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        var blob = new Blob([this.getSVG()], {
            type: "image/svg+xml"
        });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    this.getSVG = () => node.innerHTML;

    this.getPDF = (filename) => {

        const svgElement = node.firstElementChild;
        svgElement.getBoundingClientRect();
        const width = svgElement.width.baseVal.value;
        const height = svgElement.height.baseVal.value;



        const doc = new jspdf.jsPDF({
            orientation: 'l',
            unit: 'mm'
        });
        doc
            .svg(svgElement)
            .then(() => {
                // save the created pdf
                doc.save(filename)
            })


    }

}

function Alchemists() {
    var
        template = new SVGTemplate("sources/sheet.svg");

    var clone = (obj) => JSON.parse(JSON.stringify(obj));

    function getPowerLabel(power, label) {
        if (POWERS[power]) {
            if (POWERCATEGORIES[POWERS[power].category]) {
                if (POWERS[power][label]) {
                    return POWERS[power][label];
                } else {
                    console.warn("Missing power", power, "label:", type)
                    return "N/A";
                }
            } else {
                console.warn("Missing power", power, "category:", POWERS[power].category);
                return "N/A";
            }
        } else {
            console.warn("Missing power:", power);
            return "N/A";
        }
    }

    function create(data, portrait, cb) {
        var
            svg = new SVG(template);
        school = clone(GAME.schools[data.school] || GAME.schools.wanderers),
            name = (data.name || "Unnamed") + " " + school.title;

        for (var k in GAME.schools)
            if (school.id != GAME.schools[k].id) {
                console.log("Removing " + GAME.schools[k].layer);
                svg.delete(GAME.schools[k].layer);
            }

        svg.setText("lbl_credits", GAME.name + " v" + GAME.version + " - (c) " + GAME.year + " by " + GAME.author + " - " + GAME.printUrl + " - " + name + " v" + data.version + " by " + data.author);

        svg.setText("lbl_charactername", name);

        svg.setImage("img_portrait", portrait);

        for (var i = -30; i <= 30; i++) {
            if ((i < data.defense[0]) || (i > data.defense[1])) svg.delete("itm_def_" + i);
            if ((i < data.gold[0]) || (i > data.gold[1])) svg.delete("itm_gold_" + i);
            if ((i < data.attack[0]) || (i > data.attack[1])) svg.delete("itm_atk_" + i);
        }

        for (var i = 0; i <= 20; i++)
            if (i > data.health) svg.delete("itm_hp_" + i);

        data.slashCols.forEach((slash, id) => {
            if (slash) {
                svg.setText("lbl_slashcol_" + id, getPowerLabel(slash, "scrollBox"))
            } else {
                svg.delete("lbl_slashcol_" + id);
                svg.delete("box_slashcol_" + id);
            }
        })

        data.slashRows.forEach((slash, id) => {
            id++;
            if (slash) {
                svg.setText("lbl_slashrow_" + id, getPowerLabel(slash, "scrollBox"))
            } else {
                svg.delete("lbl_slashrow_" + id);
                svg.delete("box_slashrow_" + id);
            }
        })

        for (var y = 0; y < data.scrolls.length; y++) {
            for (var x = 0; x < data.scrolls[y].length; x++) {
                setText(svg, "lbl_cost_" + x + "_" + y, data.scrolls[y][x].cost);
                var
                    box = svg.getById("rect_box_" + x + "_" + y),
                    boxY = box.getAttribute("y") * 1,
                    boxHeight = box.getAttribute("height") * 1,
                    label = svg.getById("lbl_box_" + x + "_" + y),
                    labelY = label.getAttribute("y") * 1;

                switch (data.scrolls[y][x].slots.length) {
                    case 0: {
                        box.parentNode.removeChild(box);
                        label.parentNode.removeChild(label);
                        break;
                    }
                    case 1: {
                        if (data.scrolls[y][x].slots[0].power) label.innerHTML = getPowerLabel(data.scrolls[y][x].slots[0].power, "scrollBox");
                        else label.parentNode.removeChild(label);
                        break;
                    }
                    case 2: {
                        var copy = svg.copyNode(box);
                        svg.setAttributeNumber(box, "y", boxY - (boxHeight / 2));
                        svg.setAttributeNumber(label, "y", labelY - (boxHeight / 2));
                        svg.setAttributeNumber(copy, "y", boxY + (boxHeight / 2));
                        svg.insertBefore(box, copy);
                        if (data.scrolls[y][x].slots[1].power) {
                            var label2 = svg.copyNode(label);
                            label2.innerHTML = getPowerLabel(data.scrolls[y][x].slots[1].power, "scrollBox");
                            svg.setAttributeNumber(label2, "y", label.getAttribute("y") * 1 + boxHeight);
                            svg.insertBefore(label, label2);
                        }
                        if (data.scrolls[y][x].slots[0].power) label.innerHTML = getPowerLabel(data.scrolls[y][x].slots[0].power, "scrollBox");
                        else label.parentNode.removeChild(label);
                        break;
                    }
                    case 3: {
                        var
                            copy1 = svg.copyNode(box),
                            copy2 = svg.copyNode(box);
                        svg.setAttributeNumber(copy1, "y", boxY - boxHeight);
                        svg.setAttributeNumber(copy2, "y", boxY + boxHeight);
                        box.parentNode.insertBefore(copy1, box);
                        box.parentNode.insertBefore(copy2, box);
                        if (data.scrolls[y][x].slots[0].power) {
                            var label2 = svg.copyNode(label);
                            label2.innerHTML = getPowerLabel(data.scrolls[y][x].slots[0].power, "scrollBox");
                            svg.setAttributeNumber(label2, "y", label.getAttribute("y") * 1 - boxHeight);
                            svg.insertBefore(label, label2);
                        }
                        if (data.scrolls[y][x].slots[2].power) {
                            var label2 = svg.copyNode(label);
                            label2.innerHTML = getPowerLabel(data.scrolls[y][x].slots[2].power, "scrollBox");
                            svg.setAttributeNumber(label2, "y", label.getAttribute("y") * 1 + boxHeight);
                            svg.insertBefore(label, label2);
                        }
                        if (data.scrolls[y][x].slots[1].power) label.innerHTML = getPowerLabel(data.scrolls[y][x].slots[1].power, "scrollBox");
                        else label.parentNode.removeChild(label);
                        break;
                    }
                }
            }
        }

        switch (school.id) {
            case "wanderers": {
                setText(svg, "lbl_wand_5_0", getPowerLabel(data.defenseBasics[1], "smallBox"));
                setText(svg, "lbl_wand_0_5", getPowerLabel(data.attackBasics[1], "smallBox"));
                for (var i = 0; i < 6; i++)
                    setText(svg, "lbl_wand_" + i + "_" + i, getPowerLabel(data.specials[i], "smallBox"));
                for (var i = 1; i < 5; i++) {
                    setText(svg, "lbl_wand_0_" + i, getPowerLabel(data.attackBasics[0], "smallBox"));
                    setText(svg, "lbl_wand_5_" + i, getPowerLabel(data.defenseBasics[0], "smallBox"));
                    setText(svg, "lbl_wand_" + i + "_5", getPowerLabel(data.attackBasics[0], "smallBox"));
                    setText(svg, "lbl_wand_" + i + "_0", getPowerLabel(data.defenseBasics[0], "smallBox"));
                }
                data.powers.forEach((power, id) => {
                    setText(svg, "lbl_wand_" + school.powersMap[id][0][0] + "_" + school.powersMap[id][0][1], getPowerLabel(power[0], "smallBox"));
                    setText(svg, "lbl_wand_" + school.powersMap[id][1][0] + "_" + school.powersMap[id][1][1], getPowerLabel(power[1], "smallBox"));
                })
                break;
            }
            case "merchants": {
                var power, id;
                for (var y = 0; y < 6; y++)
                    for (var x = 0; x < 6; x++) {
                        id = "lbl_merc_" + x + "_" + y;
                        if (isValidId(svg, id)) {
                            power = data.market[y];
                            if (power) power = power[x];
                            if (power)
                                setText(svg, id, getPowerLabel(power, "smallBox"));
                            else
                                setText(svg, id, "");
                        }
                    }
                for (var x = 0; x < 6; x++)
                    setText(svg, "lbl_merc_price_" + x, data.prices[x]);
                setText(svg, "lbl_merc_price_dice", data.priceDice);
                break;
            }
            case "miners": {
                var power, id;
                for (var y = 0; y < 6; y++)
                    for (var x = 0; x < 6; x++) {
                        id = "lbl_mine_" + x + "_" + y;
                        if (isValidId(svg, id)) {
                            power = data.powers[y];
                            if (power) power = power[x];
                            if (power)
                                setText(svg, id, getPowerLabel(power, "smallBox"));
                            else
                                setText(svg, id, "");
                        }
                    }
                break;
            }
        }

        svg.delete("lvl_temp");

        cb(svg);
    }

    function isValidId(svg, id) {
        return !!svg.getById(id);
    }

    function setText(svg, id, text) {
        if (text === undefined) text = "N/A";
        svg.setText(id, text);
    }

    this.create = (data, cb) => {
        var
            portrait = document.createElement("img");

        portrait.src = "portraits/" + data.portrait;
        portrait.onload = () => {
            portrait.parentNode.removeChild(portrait);
            var
                canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d");
            canvas.width = portrait.width;
            canvas.height = portrait.height;
            ctx.drawImage(portrait, 0, 0);
            if (!template.getSVG()) template.load(() => create(data, canvas.toDataURL(), cb))
            else create(data, canvas.toDataURL(), cb);
        }
        document.body.appendChild(portrait);

    }

}

function Docs() {

    var
        HTMLRenderer={
            formatParagraphs:(paragraphs)=>{
                return "<p>" + paragraphs.join("</p><p>") + "</p>"
            },
            formatUnorderedList:(list)=>{
                var out = "<ul>";
                list.forEach(entry => out += "<li>" + entry + "</li>");
                out += "</ul>";
                return out;
            },
            formatOrderedList:(list)=>{
                var out = "<ol>";
                list.forEach(entry => out += "<li>" + entry + "</li>");
                out += "</ol>";
                return out;
            },
            formatSectionTitle:(title)=>{
                return "<h2>"+title+"</h2>";
            },
            formatTitle:(title)=>{
                return "<h3>"+title+"</h3>";
            },
            formatSubTitle:(title)=>{
                return "<h4>"+title+"</h4>";
            },
            formatItalic:(text)=>{
                return "<i>"+text+"</i>";
            },
            formatSchoolBox:(school)=>{
                return "<p class='school'><b>School:</b> " + school + "</b>";
            },
            formatDictionary:(list)=>{
                var html="";
                list.forEach(item=>{
                    html+="<h3>"+ item.word + "</h3><p>"+item.meaning + "<br>" + (item.extra ? "<i>"+item.extra+"</i>" : "") +"</p>";
                });
                return html;
            },
            formatPortraitBar:(image,name)=>{
                return "<div class='portraitbar'><span class='portraitimage' style='background-image:url(\"portraits/" + image + "\")'></span><span class='portraitname'>" + name + "</span></div>";
            },
            formatGenerator:(method,pos,name,version)=>{
                return "<p class='downloadbox'><a href='#' onclick='"+method+"(" + pos + ")'>Generate the " + name + " character sheet PDF v" + version + "</a></p>";
            },
            formatDownloader:(id,name,version)=>{
                return "<p class='downloadbox'><a href='pdfs/" + id + "-v" + version + ".pdf'>Download the " + name + " character sheet PDF v" + version + "</a></p>";
            },
            formatPowersTable:(table)=>{
                var html = "<table><tr><th>Power</th><th>Description</th></tr>";
                table.forEach(row=>{
                    html+="<tr><td class='powerName'><b>" + row.label + "</b></td><td>" + row.description + "</td></tr>";
                })
                html+="</table>";
                return html;
            },
            formatQA:(list)=>{
                var html="";
                list.forEach(question => {
                    html += "<p><b>Q: " + question.question + "</b><br><b>A:</b> " + question.answer + "</p>";
                });
                return html;
            },
            addImage:(image)=>{
                return "<div class='image' style='background-image:url(\"images/" + image + "\")'></div>";
            }
        },
        MarkdownRenderer={
            formatParagraphs:(paragraphs)=>{
                return paragraphs.length?paragraphs.join("\n\n")+"\n\n":"";
            },
            formatUnorderedList:(list)=>{
                var out="";
                list.forEach(entry => out += "  * " + entry + "\n");
                out+="\n";
                return out;
            },
            formatOrderedList:(list)=>{
                var out="";
                list.forEach(entry => out += "  - " + entry + "\n");
                out+="\n";
                return out;
            },
            formatSectionTitle:(title)=>{
                return "## "+title+"\n\n";
            },
            formatTitle:(title)=>{
                return "### "+title+"\n\n";
            },
            formatSubTitle:(title)=>{
                return "#### "+title+"\n\n";
            },
            formatItalic:(text)=>{
                return "_"+text+"_";
            },
            formatSchoolBox:(school)=>{
                return "**School:** " + school + "\n\n";
            },
            formatDictionary:(list)=>{
                var html="";
                list.forEach(item=>{
                    html+="#### "+ item.word + "\n"+item.meaning + "\n" + (item.extra ? "_"+item.extra+"_\n" : "") +"\n";
                });
                return html;
            },
            formatPortraitBar:(image,name)=>{
                return "<div align=\"center\" style=\"margin:60px 0\"><p><img style=\"background-color:#fff;max-height:150px\" src=\"portraits/" + image+"\"></p></div>\n\n### " + name + "\n\n";
            },
            formatGenerator:(method,pos,name,version)=>{
                return "";
            },
            formatDownloader:(id,name,version)=>{
                return "  * [Download the " + name + " character sheet PDF v" + version + "](pdfs/" + id + "-v" + version + ".pdf)\n\n";
            },
            formatPowersTable:(table)=>{
                var html = "| Power | Description |\n| --- | --- |\n";
                table.forEach(row=>{
                    html+="| **" + row.label + "** | " + row.description + " |\n";
                })
                html+="\n";
                return html;
            },
            formatQA:(list)=>{
                var html="";
                list.forEach(question => {
                    html += "**Q: " + question.question + "** \\\n**A:** " + question.answer + "\n\n";
                });
                return html;
            },
            addImage:(image)=>{
                return "<div align=\"center\" style=\"margin:60px 0\"><p><img style=\"background-color:#fff;max-height:450px\" src=\"images/" + image +"\"></p></div>\n\n";
            }
        };

    function listSorter(a, b) {
        if (a.id > b.id) return 1;
        else if (a.id < b.id) return -1;
        else return 0;
    }

    this.getTitle = function() {
        return GAME.name + " - v" + GAME.version;
    }

    this.getHtmlManual = () => {
        return this.getManual(HTMLRenderer);
    }

    this.getHtmlDownloads = (usepdf) => {
        return this.getDownloads(usepdf,HTMLRenderer);
    }

    this.getMarkdownManual = () => {
        return this.getManual(MarkdownRenderer);
    }

    this.getMarkdownDownloads = (usepdf) => {
        return this.getDownloads(usepdf,MarkdownRenderer);
    }

    this.getDownloads = (usepdf,renderer) => {
        var
            html = "";

        html += renderer.formatParagraphs(PARAGRAPHS.downloads.intro);

        CHARACTERS.forEach((character, pos) => {
            html += renderer.formatPortraitBar(character.portrait,character.name);
            html += renderer.formatSchoolBox(GAME.schools[character.school].name);            
            html += renderer.formatParagraphs([character.bio]);
            if (usepdf) {
                html += renderer.formatDownloader(character.id,character.name,character.version);
            } else {
                html += renderer.formatGenerator("Docs.downloadSheetPDF",pos,character.name,character.version);
                html += renderer.formatGenerator("Docs.downloadSheetSVG",pos,character.name,character.version);
            }
        })

        return html;

    }

    this.getManual = (renderer) => {
        var
            html = "",
            list;

        html += renderer.formatSectionTitle("Materials");
        html += renderer.formatParagraphs(PARAGRAPHS.howToPlay.neededPlayer.intro);
        html += renderer.addImage(PARAGRAPHS.howToPlay.neededPlayer.image);
        html += renderer.formatUnorderedList(PARAGRAPHS.howToPlay.neededPlayer.list);

        html += renderer.formatSectionTitle("The character sheet");
        html += renderer.formatParagraphs(PARAGRAPHS.howToPlay.characterSheetExplanation.intro);
        html += renderer.addImage(PARAGRAPHS.howToPlay.characterSheetExplanation.image);
        PARAGRAPHS.howToPlay.characterSheetExplanation.parts.forEach(part => {
            html += renderer.formatTitle(part.name) + renderer.formatParagraphs(part.description);
        });

        html += renderer.formatSectionTitle("Preparation");
        html += renderer.addImage(PARAGRAPHS.howToPlay.preparation.image);
        html += renderer.formatParagraphs(["All players:"]);
        html += renderer.formatOrderedList(PARAGRAPHS.howToPlay.preparation.allPlayers);
        html += renderer.formatParagraphs(["Then:"]);
        html += renderer.formatOrderedList(PARAGRAPHS.howToPlay.preparation.then);

        html += renderer.formatSectionTitle("Turn actions");
        html += renderer.formatParagraphs(PARAGRAPHS.howToPlay.turnActions.intro);
        PARAGRAPHS.howToPlay.turnActions.actions.forEach(action => {
            html += renderer.formatTitle(action.name);
            if (action.intro) html += renderer.formatParagraphs(action.intro);
            if (action.image) html += renderer.addImage(action.image);
            html += renderer.formatParagraphs(action.description);
            if (action.extra) action.extra.forEach(extra => {
                html += renderer.formatSubTitle(extra.name);
                if (extra.intro) html += renderer.formatParagraphs(extra.intro);
                if (extra.image) html += renderer.addImage(extra.image);
                html += renderer.formatParagraphs(extra.description);
            })
        });

        html += renderer.formatSectionTitle("Turn end");
        html += renderer.formatParagraphs(PARAGRAPHS.howToPlay.turnEnd.intro);
        html += renderer.addImage(PARAGRAPHS.howToPlay.turnEnd.image);
        html += renderer.formatOrderedList(PARAGRAPHS.howToPlay.turnEnd.steps);

        html += renderer.formatSectionTitle("Defending");
        html += renderer.formatParagraphs(PARAGRAPHS.howToPlay.defending.intro);
        html += renderer.addImage(PARAGRAPHS.howToPlay.defending.image);
        html += renderer.formatOrderedList(PARAGRAPHS.howToPlay.defending.steps);

        list = [];
        html += renderer.formatSectionTitle("Schools and Learning");
        html += renderer.formatParagraphs(PARAGRAPHS.schools.intro);
        for (var k in GAME.schools) {
            list.push({
                id: GAME.schools[k].name,
                html:renderer.formatTitle(GAME.schools[k].name) +
                    renderer.formatParagraphs(GAME.schools[k].story) +
                    renderer.addImage(GAME.schools[k].howToLearnImage) +
                    renderer.formatParagraphs([
                        renderer.formatItalic("School learning procedure: " + GAME.schools[k].howToLearn)
                    ])
            });
        }
        list.sort(listSorter);
        list.forEach(item => {
            html += item.html;
        });

        list = [];
        html += renderer.formatSectionTitle("Dictionary");
        for (var k in DICTIONARY) {
            list.push({
                id: DICTIONARY[k].word,
                word:DICTIONARY[k].word,
                meaning:DICTIONARY[k].meaning,
                extra:DICTIONARY[k].extra
            });
        }
        list.sort(listSorter);
        html+=renderer.formatDictionary(list);

        list = [];
        html += renderer.formatSectionTitle("Powers");
        html += renderer.formatParagraphs(PARAGRAPHS.powers.intro);

        for (var k in POWERCATEGORIES) {
            list.push({
                id: POWERCATEGORIES[k].label,
                label:POWERCATEGORIES[k].label,
                description:POWERCATEGORIES[k].description
            });
        }
        list.sort(listSorter);
        html+=renderer.formatPowersTable(list);

        html += renderer.formatSectionTitle("FAQ");
        html += renderer.formatParagraphs(PARAGRAPHS.faq.intro);
        html += renderer.formatQA(PARAGRAPHS.faq.questions);

        return html;

    }

    this.getHtmlFooter = () => {
        return GAME.name + " v" + GAME.version + " &dash; &copy; " + GAME.year + " by " + GAME.author + " &dash; <a href='" + GAME.url + "'>" + GAME.url + "</a> &dash; <a href='" + GAME.sourcesUrl + "'>" + GAME.sourcesUrl + "</a>";
    }
}

Docs.downloadSheetPDF = (id) => {
    var alchemists = new Alchemists();
    alchemists.create(CHARACTERS[id], (svg) => {
        svg.getPDF(CHARACTERS[id].id + "-v" + CHARACTERS[id].version + ".pdf");
    });
}

Docs.downloadSheetSVG = (id) => {
    var alchemists = new Alchemists();
    alchemists.create(CHARACTERS[id], (svg) => {
        svg.download(CHARACTERS[id].id + "-v" + CHARACTERS[id].version + ".svg");
    });
}

Docs.getSheetSVG = (id, cb) => {
    var alchemists = new Alchemists();
    alchemists.create(CHARACTERS[id], (svg) => {
        cb(svg.getSVG());
    });
}