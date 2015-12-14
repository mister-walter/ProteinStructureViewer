/*
var protein;
var alphas;
var betas;

function load(pdb_id) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'pdbs/' + pdb_id + '.pdb');
    xhr.setRequestHeader('Content-type', 'application/x-pdb');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            protein = pv.io.pdb(xhr.responseText);
            alphas = protein.
        }
    }
    xhr.send();
}*/
var pviz = this.pviz;
var structure;
var protein_3d;
var chromophore;
var protein_sequence;
var pviz_view;

$(document).ready(function () {
    function load_fasta(fasta_id) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'fasta/' + fasta_id + '.fasta.txt');
        xhr.setRequestHeader('Content-type', 'text/plain');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var reader = new pviz.FastaReader;
                protein_sequence = reader.buildSeqEntry(xhr.responseText);
                d3.tsv('features/' + fasta_id + '.tsv', function (err, data) {
                    protein_sequence.addFeatures(data);
                });
                d3.tsv('features/' + fasta_id + '.extra.tsv', function (err, data) {
                    protein_sequence.addFeatures(data);
                });

                pviz_view = new pviz.SeqEntryAnnotInteractiveView({
                    model: protein_sequence,
                    el: '#main',
                });
                pviz_view.render();
            }
        }
        xhr.send();
    }

    protein_3d = pv.Viewer(document.getElementById('gl'), {
        quality: 'medium',
        //width: 500,
        //height: 500,
        width: 'auto',
        height: 'auto',
        antialias: true,
        outline: true
    });

    function showProtein() {
        protein_3d.clear();
        protein_3d.cartoon('protein', structure, {
            color: color.ssSuccession()
        });
        protein_3d.ballsAndSticks('chromophore', chromophore);
    }

    function getProteinAtomSets() {
        chromophore = structure.atomSelect(function (a) {
            return a.residue().num() === 66;
        });
    }

    function load_pdb(pdb_id) {
        document.getElementById('status').innerHTML = 'loading ' + pdb_id;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'pdbs/' + pdb_id + '.pdb');
        xhr.setRequestHeader('Content-type', 'application/x-pdb');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                structure = pv.io.pdb(xhr.responseText);
                getProteinAtomSets();
                showProtein();
                protein_3d.centerOn(structure);
            }
            document.getElementById('status').innerHTML = '';
        }
        xhr.send();
    }

    window.onresize = function (event) {
        protein_3d.fitParent();
    };

    load_fasta('1EMA');
    load_pdb('1EMA');

    var selectedFeature;
    /*
     * add a mouseover/mouseout call back based on the feature type
     */
    pviz.FeatureDisplayer.addClickCallback(['helix', 'turn', 'beta_strand', 'functional'], function (ft) {
        selectedFeature = ft;
        
        /* For each view in the 3d protein view, select the clicked feature */
        protein_3d.forEach(function (geom) {
            var sel = geom.select({
                rnumRange: [ft.start, ft.end]
            });
            geom.setSelection(sel);
        });

        protein_3d.requestRedraw();
    });
});