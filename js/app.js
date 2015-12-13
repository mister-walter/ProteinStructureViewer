define(['jquery', 'underscore', 'pviz', 'bio-pv'], function ($, _, pviz, pv) {
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

    $(function () {
        var seq = 'MELAALCRWGLLLALLPPGAASTQVCTGTDMKLRLPASPETHLDMLRHLYQGCQVVQGNLELTYLPTNASLSFLQDIQEVQGYVLIAHNQVRQVPLQRLRIVRGTQLFEDNYALAVLDNGDPLNNTTPVTGASPGGLRELQLRSLTEILKGGVLIQRNPQLCYQDTILWKDIFHKNNQLA';
        var seqEntry = new pviz.SeqEntry({
            sequence: seq
        });

        seqEntry.addFeatures([
            {
                category: 'secondary structure',
                type: 'beta_strand',
                start: 24,
                end: 26
            }
        ]);

        seqEntry.addFeatures([
            {
                category: 'secondary structure',
                type: 'beta_strand',
                start: 50,
                end: 90
            }
        ]);

        var pviz_view = new pviz.SeqEntryAnnotInteractiveView({
            model: seqEntry,
            el: '#main',
        });
        pviz_view.render();

        var protein_3d = pv.Viewer(document.getElementById('gl'), {
            quality: 'medium',
            //width: 500,
            //height: 500,
            width: 'auto',
            height: 'auto',
            antialias: true,
            outline: true
        });

        var structure;
        var basegeom;

        function lines() {
            protein_3d.clear();
            protein_3d.lines('structure', structure);
        }

        function cartoon() {
            protein_3d.clear();
            basegeom = protein_3d.cartoon('structure', structure, {
                color: color.ssSuccession()
            });
        }

        function lineTrace() {
            protein_3d.clear();
            protein_3d.lineTrace('structure', structure);
        }

        function sline() {
            protein_3d.clear();
            protein_3d.sline('structure', structure);
        }

        function tube() {
            protein_3d.clear();
            protein_3d.tube('structure', structure);
        }

        function trace() {
            protein_3d.clear();
            protein_3d.trace('structure', structure);
        }

        function preset() {
            protein_3d.clear();
            var ligand = structure.select({
                rnames: ['RVP', 'SAH']
            });
            protein_3d.ballsAndSticks('ligand', ligand);
            basegeom = protein_3d.cartoon('protein', structure);
        }

        function load(pdb_id) {
            document.getElementById('status').innerHTML = 'loading ' + pdb_id;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'pdbs/' + pdb_id + '.pdb');
            xhr.setRequestHeader('Content-type', 'application/x-pdb');
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    structure = pv.io.pdb(xhr.responseText);
                    preset();
                    protein_3d.centerOn(structure);
                }
                document.getElementById('status').innerHTML = '';
            }
            xhr.send();
        }

        function gfp() {
            load('1EMA');
        }

        window.onresize = function (event) {
            protein_3d.fitParent();
        }

        //document.addEventListener('DOMContentLoaded', gfp);

        gfp();
        var sel;
        var selectedFeature;
        /*
         * add a mouseover/mouseout call back based on the feature type
         */
        pviz.FeatureDisplayer.addClickCallback(['helix', 'turn', 'beta_strand'], function (ft) {
            selectedFeature = ft;
            console.log(ft.start + " " + ft.end);
            sel = basegeom.select({
                rnumRange: [ft.start, ft.end]
            });
            //sel = picked.node().structure().createEmptyView();
            basegeom.setSelection(sel);
            protein_3d.requestRedraw();

        });


    });
});