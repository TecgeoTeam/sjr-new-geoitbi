        var rendererVisible;
        define([
            'dojo/_base/declare',
            'jimu/BaseWidget',
            'dojo/number',
            'esri/InfoTemplate',
            'esri/layers/FeatureLayer',
            './clusterlayer/clusterfeaturelayer',
            'esri/renderers/ClassBreaksRenderer',
            'esri/symbols/SimpleMarkerSymbol',
            'esri/symbols/SimpleLineSymbol',
            'dojo/_base/Color',
            "esri/layers/GraphicsLayer",
            "esri/graphic",

            "dojo/dom-style",
            'dojo/dom',
            'dojo/domReady!'
            ], function(
                declare,
                BaseWidget,
                number,
                InfoTemplate,
                FeatureLayer,
                ClusterFeatureLayer,
                ClassBreaksRenderer,
                SimpleMarkerSymbol,
                SimpleLineSymbol,
                Color,
                GraphicsLayer,
                Graphic,

                domStyle,
                dom
                ) {
                var url = 'http://172.16.32.46/gis/rest/services/SL_ITBI/Mapas_Tematicos_ITBI/MapServer/2';
                var outputFields = [];
                var outputFieldLabels = [];
                var outputFieldsValues = [];
                var self;


                var clazz = declare([BaseWidget], {
                    baseClass: 'jimu-widget-pointcluster',
                    name: 'PointCluster',
                    postCreate: function() {
                        self = this;
                        self.isShowingCluster= true;
                         self.isShowingClusterde_tipologia= true;
                        $.ajaxSetup({
                            async: false
                        });
                        $.getJSON(url, function(data) {
                            var serviceJson = data;

                            for (var i = 0; i < data.fields.length; i++) {
                                if (data.fields[i].type === "esriFieldTypeDouble") {
                                    outputFields.push(data.fields[i]);
                                    outputFieldLabels.push(data.fields[i].alias);
                                    outputFieldsValues.push(data.fields[i].name);
                                }

                            }
                            console.log(outputFieldsValues);


                            $.ajaxSetup({
                                async: true
                            });
                        //data is the JSON string
                    });
                        self.clusterTerritorialWasCreated = false;
                        self.clusterde_tipologiaWasCreated = false;
                        //self.showClusterde_tipologia();

                    },

                // start up child widgets
                startup: function() {
                    self = this
                    if (self.config.inPanelVar) {
                    }
                },

                showClusterTerritorial: function () {
            //CLUSTER
            var 
            popup,
            clusterPredial,
            clusterTerritorial,
            geocoder,
            infoTemplatePredial,
            defaultSym1,
            selectedSym1,
            defaultSym2,
            selectedSym2,
            activeClusterElement;
            self.activeClusterElement = activeClusterElement;
            self.clusterPredial = clusterPredial;
            self.clusterTerritorial = clusterTerritorial;

            var map = self.map;
            // Add clusters 
            // Add layer

            infoTemplatePredial = new InfoTemplate("<b>${OBJECTID}</b>",
                "<div class='mainSection'> <div class='header' dojoattachpoint='_title'>Pesquisas</div> <div class='hzLine'></div> <div dojoattachpoint='_description'> <table class='attrTable' cellpadding='0px' cellspacing='0px'> <tbody> <tr valign='top'> <td class='attrName'>Geocode</td> <td class='attrValue'>${Geocode}</td> </tr> <tr valign='top'> <td class='attrName'>Geocode_Correto</td> <td class='attrValue'>${Geocode_Correto}</td> </tr> <tr valign='top'> <td class='attrName'>Geo_Renum_Testada</td> <td class='attrValue'>${Geo_Renum_Testada}</td> </tr> <tr valign='top'> <td class='attrName'>Tipo do Imovel</td> <td class='attrValue'>${de_Tipo_do_Imovel}</td> </tr> <tr valign='top'> <td class='attrName'>Tipologia</td> <td class='attrValue'>${de_tipologia}</td> </tr> <tr valign='top'> <td class='attrName'>Tipologia Cadastro</td> <td class='attrValue'>${de_tipologia_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Cadastrador</td> <td class='attrValue'>${de_Cadastrador}</td> </tr> <tr valign='top'> <td class='attrName'>Padrao</td> <td class='attrValue'>${de_Padrao}</td> </tr> <tr valign='top'> <td class='attrName'>Idade</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Idade}</span></td> </tr> <tr valign='top'> <td class='attrName'>Conservação</td> <td class='attrValue'>${de_Conservacao}</td> </tr> <tr valign='top'> <td class='attrName'>Conservação Cadastro</td> <td class='attrValue'>${de_Conservacao_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Quarto Residencial/Sala Comercial</td> <td class='attrValue'><span class='esriNumericValue'>${Quarto_Residencial_Sala_Comerci}</span></td> </tr> <tr valign='top'> <td class='attrName'>Banheiros</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Banheiros}</span></td> </tr> <tr valign='top'> <td class='attrName'>Garagens</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Garagens}</span></td> </tr> <tr valign='top'> <td class='attrName'>Pavimento</td> <td class='attrValue'>${de_Pavimento}</td> </tr> <tr valign='top'> <td class='attrName'>Valor Mercado</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Valor_Mercado}</span></td> </tr> <tr valign='top'> <td class='attrName'>Tipo Lote</td> <td class='attrValue'>${de_Tipo_Lote}</td> </tr> <tr valign='top'> <td class='attrName'>Área de Terreno Site</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Area_de_Terreno_Site}</span></td> </tr> <tr valign='top'> <td class='attrName'>Área do Terreno Cadastro</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Area_do_Terreno_Cadastro}</span></td> </tr> <tr valign='top'> <td class='attrName'>Testada Cadastro</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Testada_Cadastro}</span></td> </tr> <tr valign='top'> <td class='attrName'>Testada Site</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Testada_Site}</span></td> </tr> <tr valign='top'> <td class='attrName'>Tipo Pavimento</td> <td class='attrValue'>${de_Tipo_Pavimento}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Elétrica Cadastro</td> <td class='attrValue'>${de_Rede_Eletrica_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Iluminação Cadastro</td> <td class='attrValue'>${de_Iluminacao_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Água Cadastro</td> <td class='attrValue'>${de_Rede_Agua_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Esgoto Cadastro</td> <td class='attrValue'>${de_Rede_Esgoto_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Drenagem Cadastro</td> <td class='attrValue'>${de_Rede_Drenagem_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Bairro</td> <td class='attrValue'>${de_Bairro}</td> </tr> <tr valign='top'> <td class='attrName'>Endereço</td> <td class='attrValue'>${de_Endereco}</td> </tr> <tr valign='top'> <td class='attrName'>Fonte Pesquisa</td> <td class='attrValue'>${de_Fonte_Pesquisa}</td> </tr> <tr valign='top'> <td class='attrName'>Contato Fonte PVG</td> <td class='attrValue'>${de_Contato_Fonte_PVG}</td> </tr> <tr valign='top'> <td class='attrName'>Imobiliaria</td> <td class='attrValue'>${de_Imobiliaria}</td> </tr> <tr valign='top'> <td class='attrName'>Foto Link</td> <td class='attrValue'><a target='_blank' href='${de_foto_link}' title='${de_foto_link}'>Mais info</a></td> </tr> <tr valign='top'> <td class='attrName'>Rede Elétrica</td> <td class='attrValue'>${de_Rede_Eletrica}</td> </tr> <tr valign='top'> <td class='attrName'>Iluminação</td> <td class='attrValue'>${de_Iluminacao}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Água</td> <td class='attrValue'>${de_Rede_Agua}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Esgoto</td> <td class='attrValue'>${de_Rede_Esgoto}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Drenagem</td> <td class='attrValue'>${de_Rede_Drenagem}</td> </tr> <tr valign='top'> <td class='attrName'>Telefone</td> <td class='attrValue'>${de_Telefone}</td> </tr> <tr valign='top'> <td class='attrName'>Data do Cadastro</td> <td class='attrValue'><span class='esriDateValue'>${dt_Data_Cadastro}</span></td> </tr> <tr valign='top'> <td class='attrName'>Link Site</td> <td class='attrValue'>${de_Link_Site}</td> </tr> <tr valign='top'> <td class='attrName'>Topografia Cadastro</td> <td class='attrValue'>${de_Topografia_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Pedologia Cadastro</td> <td class='attrValue'>${de_Pedologia_Cadastro}</td> </tr> </tbody> </table> </div> <div class='mediaSection'> <div class='header' dojoattachpoint='_mediaTitle'>Imagem</div> <div class='hzLine hidden'></div> <div class='caption hidden' dojoattachpoint='_mediaCaption'></div> <div class='gallery' dojoattachpoint='_gallery'> <div class='mediaHandle prev hidden' dojoattachpoint='_prevMedia' dojoattachevent='onclick: _goToPrevMedia' title='Mídia anterior'></div> <div class='mediaHandle next hidden' dojoattachpoint='_nextMedia' dojoattachevent='onclick: _goToNextMedia' title='Próxima mídia'></div> <ul class='summary hidden'> <li class='image mediaCount hidden' dojoattachpoint='_imageCount'>0</li> <li class='image mediaIcon hidden'></li> <li class='chart mediaCount hidden' dojoattachpoint='_chartCount'>0</li> <li class='chart mediaIcon hidden'></li> </ul> <div class='frame image' dojoattachpoint='_mediaFrame' style='user-select: none;'><a href='${de_foto_link}' target='_blank'><img class='esriPopupMediaImage' style='width: 200px' src='${de_foto_link}'></a></div> </div> </div>"
                );
            //you can hide popup on clusterlayer.js


            defaultSym1 = new SimpleMarkerSymbol("circle", 16,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([72,118,255, 0.55]), 3),
                new Color([255, 255, 255, 1]));
            defaultSym2 = new SimpleMarkerSymbol("circle", 16,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([212,116,60, 0.55]), 3),
                new Color([255, 255, 255, 1]));

            selectedSym1 = new SimpleMarkerSymbol("circle", 16,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([72,118,255, 0.85]), 3),
                new Color([255, 255, 255, 1]));
            selectedSym2 = new SimpleMarkerSymbol("circle", 16,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([212,116,60, 0.85]), 3),
                new Color([255, 255, 255, 1]));

            addClusterLayer();
            addClusterLayerEvents();


         // Create a feature layer to get feature service
         function addClusterLayer() {
            var renderer1,
            small1,
            medium1,
            large1,
            xlarge1,
            renderer2,
            small2,
            medium2,
            large2,
            xlarge2;

            // Add cluster renderer
            self.clusterPredial = new ClusterFeatureLayer({
                "url": "https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/1",
                //"url": "http://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/GlobalSeismographyNetwork/FeatureServer/0",
                // "url": "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/Since_1970/MapServer/0",
                "distance": 95,
                "id": "clusters1",
                "labelColor": "#fff",
                "resolution": map.extent.getWidth() / map.width,
                //"singleColor": "#888",
                "singleSymbol": defaultSym1,
                "singleTemplate": infoTemplatePredial,
                "useDefaultSymbol": false,
                "zoomOnClick": true,
                "showSingles": true,
                "objectIdField": "OBJECTID",
                "where": "de_tipo_do_imovel = 'Predial'",
                outFields: ["*"]
            });
            self.clusterTerritorial = new ClusterFeatureLayer({
                "url": "https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/1",
                //"url": "http://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/GlobalSeismographyNetwork/FeatureServer/0",
                // "url": "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/Since_1970/MapServer/0",
                "distance": 95,
                "id": "clusters2",
                "labelColor": "#fff",
                "resolution": map.extent.getWidth() / map.width,
                //"singleColor": "#888",
                "singleSymbol": defaultSym2,
                "singleTemplate": infoTemplatePredial,
                "useDefaultSymbol": false,
                "zoomOnClick": true,
                "showSingles": true,
                "objectIdField": "OBJECTID",
                "where": "de_tipo_do_imovel = 'Territorial'",
                outFields: ["*"]
            });
            console.log(self.clusterPredial);
            console.log(self.clusterTerritorial);
            renderer1 = new ClassBreaksRenderer(defaultSym1, "clusterCount");

            renderer2 = new ClassBreaksRenderer(defaultSym2, "clusterCount");

            // blue Clusters
            small1 = new SimpleMarkerSymbol("circle", 25,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([72,118,255,0.5]), 15),
                new Color([72,118,255,0.75]));
            medium1 = new SimpleMarkerSymbol("circle", 50,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([67,110,238,0.5]), 15),
                new Color([67,110,238,0.75]));
            large1 = new SimpleMarkerSymbol("circle", 80,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([58,95,205,0.5]), 15),
                new Color([58,95,205,0.75]));
            xlarge1 = new SimpleMarkerSymbol("circle", 110,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([39,64,139,0.5]), 15),
                new Color([39,64,139,0.75]));
            // red Clusters
            small2 = new SimpleMarkerSymbol("circle", 25,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([212,116,60,0.75]), 15),
                new Color([212,116,60,0.75]));
            medium2 = new SimpleMarkerSymbol("circle", 50,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([178,70,37,0.5]), 15),
                new Color([178,70,37,0.5]));
            large2 = new SimpleMarkerSymbol("circle", 80,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([144,24,13,0.5]), 15),
                new Color([144,24,13,0.5]));
            xlarge2 = new SimpleMarkerSymbol("circle", 110,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([102,0,0,0.5]), 15),
                new Color([102,0,0,0.5]));

            // Break values - can adjust easily
            renderer1.addBreak(2, 10, small1);
            renderer1.addBreak(11, 25, medium1);
            renderer1.addBreak(26, 46, large1);
            renderer1.addBreak(47, 50000, xlarge1);

            renderer2.addBreak(2, 10, small2);
            renderer2.addBreak(11, 25, medium2);
            renderer2.addBreak(100, 150, large2);
            renderer2.addBreak(150, 50000, xlarge2);




            // Providing a ClassBreakRenderer is also optional
            self.clusterPredial.setRenderer(renderer1);
            self.clusterTerritorial.setRenderer(renderer2);
            map.addLayer(self.clusterPredial);
            map.addLayer(self.clusterTerritorial);
        }



        // Create new graphic and add to map.graphics
        function addSelectedFeature() {
            var selIndex = map.infoWindow.selectedIndex,
            selFeature;
            if (selIndex !== -1) {
                selFeature = map.infoWindow.features[selIndex];
                // Remove old feature first
                removeSelectedFeature();
                // Add new graphic
                self.map.infoWindow._lastSelected = new Graphic(selFeature.toJson());
                map.infoWindow._lastSelected.setSymbol(selectedSym1. selectedSym2);
                map.graphics.add(map.infoWindow._lastSelected);
            }
        }

         // Remove graphic from map.graphics
        function removeSelectedFeature() {
            if (map.infoWindow._lastSelected) {
                map.graphics.remove(map.infoWindow._lastSelected);
                map.infoWindow._lastSelected = null;
            }
        }

        // Highlight clusters
        function setActiveClusterOpacity(elem, fillOpacity, strokeOpacity) {
            var textElm;
            if (elem) {
                elem.setAttribute("fill-opacity", fillOpacity);
                elem.setAttribute("stroke-opacity", strokeOpacity);
                // Overide inherited properties for the text in the circle
                textElm = elem.nextElementSibling;
                if (textElm && textElm.nodeName === "text") {
                    textElm.setAttribute("fill-opacity", 1);
                }
            }
        }

        

        //Hide popup if selected feature is clustered
        function onClustersShown(clusters1, clusters2) {
            var  i = 0,
                extent;
            if (map.infoWindow.isShowing && map.infoWindow._lastSelected) {
                for (i; i < clusters.length; i++) {
                    if (clusters[i].attributes.clusterCount > 1) {
                        extent = self.clusterPredial._getClusterExtent(clusters[i]);
                        if (extent.contains(map.infoWindow._lastSelected.geometry)) {
                            map.infoWindow.hide();
                            break;
                        }
                    }
                }
            }
        }

        // Wire cluster layer events
        function addClusterLayerEvents() {
            // Mouse over events
            self.clusterPredial.on("mouse-over", onMouseOverCluster);
            self.clusterPredial.on("mouse-out", onMouseOutCluster);
            self.clusterTerritorial.on("mouse-over", onMouseOverCluster);
            self.clusterTerritorial.on("mouse-out", onMouseOutCluster);
            // Clusters drawn
            self.clusterPredial.on("clusters-shown", onClustersShown);
            self.clusterTerritorial.on("clusters-shown", onClustersShown);
        }

       //  // Save the last selected graphic so we can highlight it
        map.infoWindow.on("selection-change", function () {
            addSelectedFeature();
            //animateInfoWindow();
       });

        // Clear selected graphic when infoWindow is hidden
        map.infoWindow.on("hide", function () {
            // re-activate cluster
            self.setActiveClusterOpacity(self.activeClusterElement, 0.75, 0.5);
            removeSelectedFeature();
        });

        // Popup enhancements
        function onMouseOverCluster(e) {
            if (e.graphic.attributes.clusterCount === 1) {
                e.graphic._graphicsLayer.onClick(e);
            } else {
                if (e.target.nodeName === "circle") {
                    self.activeClusterElement = e.target;
                    self.setActiveClusterOpacity(self.activeClusterElement, 1, 1);
                } else {
                    self.setActiveClusterOpacity(self.activeClusterElement, 1, 1);
                }
            }
        }

        function onMouseOutCluster(e) {
            if (e.graphic.attributes.clusterCount > 1) {
                if (e.target.nodeName === "circle" || e.target.nodeName === "text") {
                    self.setActiveClusterOpacity(self.activeClusterElement, 0.75, 0.5);
                    self.setActiveClusterOpacity(e.target, 0.75, 0.5);
                }
            }
        }

        // function animateInfoWindow() {
        //     domStyle.set(map.infoWindow.domNode, "opacity", 0);
        //     fx.fadeIn({node: map.infoWindow.domNode,
        //         duration: 150,
        //         easing: easing.quadIn}).play();
        // }

         // Click to close
        map.on('click', function () {
            if (map.infoWindow.isShowing) {
                map.infoWindow.hide();
            }
        });

        // ESC is pressed
        map.on('key-down', function (e) {
            if (e.keyCode === 27) {
                map.infoWindow.hide();
            }
        });

        // Dynamically reposition popups when map moves
        map.on('extent-change', function () {
            if (map.infoWindow.isShowing) {
                map.infoWindow.reposition();
            }
        });
    },

    showClusterde_tipologia: function () {
            //CLUSTER
            var 
            popup,
            clusterLayerSemInformacao,
            clusterLayerApartamento,
            clusterLayerCasa,
            clusterLayerComercialcomResidencial,
            clusterLayerEdificioComercial,
            clusterLayerGalpao,
            clusterLayerLojaSalaConjunto,
            clusterLayerSobrado,
            geocoder,
            infoTemplate,
            defaultSymSemInformacao,
            selectedSymSemInformacao,
            defaultSymApartamento,
            selectedSymApartamento,
            defaultSymCasa,
            selectedSymCasa,
            defaultSymComercialcomResidencial,
            selectedSymComercialcomResidencial,
            defaultSymEdificioComercial,
            selectedSymEdificioComercial,
            defaultSymGalpao,
            selectedSymGalpao,
            defaultSymLojaSalaConjunto,
            selectedSymLojaSalaConjunto,
            defaultSymSobrado,
            selectedSymSobrado,
            activeClusterElement;
            self.clusterLayerSemInformacao = clusterLayerSemInformacao;
            self.clusterLayerApartamento = clusterLayerApartamento;
            self.clusterLayerCasa = clusterLayerCasa;
            self.clusterLayerComercialcomResidencial = clusterLayerComercialcomResidencial;
            self.clusterLayerEdificioComercial = clusterLayerEdificioComercial;
            self.clusterLayerGalpao = clusterLayerGalpao;
            self.clusterLayerLojaSalaConjunto = clusterLayerLojaSalaConjunto;
            self.clusterLayerSobrado = clusterLayerSobrado;

            var map = self.map;

            infoTemplateTipologia = new InfoTemplate("<b>${OBJECTID}</b>",
                "<div class='mainSection'> <div class='header' dojoattachpoint='_title'>Pesquisas</div> <div class='hzLine'></div> <div dojoattachpoint='_description'> <table class='attrTable' cellpadding='0px' cellspacing='0px'> <tbody> <tr valign='top'> <td class='attrName'>Geocode</td> <td class='attrValue'>${Geocode}</td> </tr> <tr valign='top'> <td class='attrName'>Geocode_Correto</td> <td class='attrValue'>${Geocode_Correto}</td> </tr> <tr valign='top'> <td class='attrName'>Geo_Renum_Testada</td> <td class='attrValue'>${Geo_Renum_Testada}</td> </tr> <tr valign='top'> <td class='attrName'>Tipo do Imovel</td> <td class='attrValue'>${de_Tipo_do_Imovel}</td> </tr> <tr valign='top'> <td class='attrName'>Tipologia</td> <td class='attrValue'>${de_tipologia}</td> </tr> <tr valign='top'> <td class='attrName'>Tipologia Cadastro</td> <td class='attrValue'>${de_tipologia_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Cadastrador</td> <td class='attrValue'>${de_Cadastrador}</td> </tr> <tr valign='top'> <td class='attrName'>Padrao</td> <td class='attrValue'>${de_Padrao}</td> </tr> <tr valign='top'> <td class='attrName'>Idade</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Idade}</span></td> </tr> <tr valign='top'> <td class='attrName'>Conservação</td> <td class='attrValue'>${de_Conservacao}</td> </tr> <tr valign='top'> <td class='attrName'>Conservação Cadastro</td> <td class='attrValue'>${de_Conservacao_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Quarto Residencial/Sala Comercial</td> <td class='attrValue'><span class='esriNumericValue'>${Quarto_Residencial_Sala_Comerci}</span></td> </tr> <tr valign='top'> <td class='attrName'>Banheiros</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Banheiros}</span></td> </tr> <tr valign='top'> <td class='attrName'>Garagens</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Garagens}</span></td> </tr> <tr valign='top'> <td class='attrName'>Pavimento</td> <td class='attrValue'>${de_Pavimento}</td> </tr> <tr valign='top'> <td class='attrName'>Valor Mercado</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Valor_Mercado}</span></td> </tr> <tr valign='top'> <td class='attrName'>Tipo Lote</td> <td class='attrValue'>${de_Tipo_Lote}</td> </tr> <tr valign='top'> <td class='attrName'>Área de Terreno Site</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Area_de_Terreno_Site}</span></td> </tr> <tr valign='top'> <td class='attrName'>Área do Terreno Cadastro</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Area_do_Terreno_Cadastro}</span></td> </tr> <tr valign='top'> <td class='attrName'>Testada Cadastro</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Testada_Cadastro}</span></td> </tr> <tr valign='top'> <td class='attrName'>Testada Site</td> <td class='attrValue'><span class='esriNumericValue'>${nu_Testada_Site}</span></td> </tr> <tr valign='top'> <td class='attrName'>Tipo Pavimento</td> <td class='attrValue'>${de_Tipo_Pavimento}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Elétrica Cadastro</td> <td class='attrValue'>${de_Rede_Eletrica_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Iluminação Cadastro</td> <td class='attrValue'>${de_Iluminacao_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Água Cadastro</td> <td class='attrValue'>${de_Rede_Agua_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Esgoto Cadastro</td> <td class='attrValue'>${de_Rede_Esgoto_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Drenagem Cadastro</td> <td class='attrValue'>${de_Rede_Drenagem_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Bairro</td> <td class='attrValue'>${de_Bairro}</td> </tr> <tr valign='top'> <td class='attrName'>Endereço</td> <td class='attrValue'>${de_Endereco}</td> </tr> <tr valign='top'> <td class='attrName'>Fonte Pesquisa</td> <td class='attrValue'>${de_Fonte_Pesquisa}</td> </tr> <tr valign='top'> <td class='attrName'>Contato Fonte PVG</td> <td class='attrValue'>${de_Contato_Fonte_PVG}</td> </tr> <tr valign='top'> <td class='attrName'>Imobiliaria</td> <td class='attrValue'>${de_Imobiliaria}</td> </tr> <tr valign='top'> <td class='attrName'>Foto Link</td> <td class='attrValue'><a target='_blank' href='${de_foto_link}' title='${de_foto_link}'>Mais info</a></td> </tr> <tr valign='top'> <td class='attrName'>Rede Elétrica</td> <td class='attrValue'>${de_Rede_Eletrica}</td> </tr> <tr valign='top'> <td class='attrName'>Iluminação</td> <td class='attrValue'>${de_Iluminacao}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Água</td> <td class='attrValue'>${de_Rede_Agua}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Esgoto</td> <td class='attrValue'>${de_Rede_Esgoto}</td> </tr> <tr valign='top'> <td class='attrName'>Rede Drenagem</td> <td class='attrValue'>${de_Rede_Drenagem}</td> </tr> <tr valign='top'> <td class='attrName'>Telefone</td> <td class='attrValue'>${de_Telefone}</td> </tr> <tr valign='top'> <td class='attrName'>Data do Cadastro</td> <td class='attrValue'><span class='esriDateValue'>${dt_Data_Cadastro}</span></td> </tr> <tr valign='top'> <td class='attrName'>Link Site</td> <td class='attrValue'>${de_Link_Site}</td> </tr> <tr valign='top'> <td class='attrName'>Topografia Cadastro</td> <td class='attrValue'>${de_Topografia_Cadastro}</td> </tr> <tr valign='top'> <td class='attrName'>Pedologia Cadastro</td> <td class='attrValue'>${de_Pedologia_Cadastro}</td> </tr> </tbody> </table> </div> <div class='mediaSection'> <div class='header' dojoattachpoint='_mediaTitle'>Imagem</div> <div class='hzLine hidden'></div> <div class='caption hidden' dojoattachpoint='_mediaCaption'></div> <div class='gallery' dojoattachpoint='_gallery'> <div class='mediaHandle prev hidden' dojoattachpoint='_prevMedia' dojoattachevent='onclick: _goToPrevMedia' title='Mídia anterior'></div> <div class='mediaHandle next hidden' dojoattachpoint='_nextMedia' dojoattachevent='onclick: _goToNextMedia' title='Próxima mídia'></div> <ul class='summary hidden'> <li class='image mediaCount hidden' dojoattachpoint='_imageCount'>0</li> <li class='image mediaIcon hidden'></li> <li class='chart mediaCount hidden' dojoattachpoint='_chartCount'>0</li> <li class='chart mediaIcon hidden'></li> </ul> <div class='frame image' dojoattachpoint='_mediaFrame' style='user-select: none;'><a href='${de_foto_link}' target='_blank'><img class='esriPopupMediaImage' style='width: 200px' src='${de_foto_link}'></a></div> </div> </div>");

        defaultSymSemInformacao = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,110,180, 0.55]), 3),
                        new Color([255, 255, 255, 1]));
        selectedSymSemInformacao = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,110,180, 0.85]), 3),
                        new Color([255, 255, 255, 1]));

        defaultSymApartamento = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([139,0,0, 0.55]), 3),
                        new Color([255, 255, 255, 1]));
        selectedSymApartamento = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([139,0,0, 0.85]), 3),
                        new Color([255, 255, 255, 1]));

        defaultSymCasa = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,185,15, 0.55]), 3),
                        new Color([255, 255, 255, 1]));
        selectedSymCasa = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,185,15, 0.85]), 3),
                        new Color([255, 255, 255, 1]));

        defaultSymComercialcomResidencial = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,245,255, 0.55]), 3),
                        new Color([255, 255, 255, 1]));
        selectedSymComercialcomResidencial = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,245,255, 0.85]), 3),
                        new Color([255, 255, 255, 1]));

        defaultSymEdificioComercial = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([155,48,255, 0.55]), 3),
                        new Color([255, 255, 255, 1]));
        selectedSymEdificioComercial = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([155,48,255, 0.85]), 3),
                        new Color([255, 255, 255, 1]));

        defaultSymGalpao = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([193,255,193, 0.55]), 3),
                        new Color([255, 255, 255, 1]));
        selectedSymGalpao = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([193,255,193, 0.85]), 3),
                        new Color([255, 255, 255, 1]));

        defaultSymLojaSalaConjunto = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([65,105,225, 0.55]), 3),
                        new Color([255, 255, 255, 1]));
        selectedSymLojaSalaConjunto = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([65,105,225, 0.85]), 3),
                        new Color([255, 255, 255, 1]));

        defaultSymSobrado = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,139,0, 0.55]), 3),
                        new Color([255, 255, 255, 1]));
        selectedSymSobrado = new SimpleMarkerSymbol("circle", 16,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,139,0, 0.85]), 3),
                        new Color([255, 255, 255, 1]));

            addClusterLayer();
            addClusterLayerEvents();

         // Create a feature layer to get feature service
         function addClusterLayer() {
            var rendererSemInformacao,
                smallSemInformacao,
                mediumSemInformacao,
                largeSemInformacao,
                xlargeSemInformacao,
                rendererApartamento,
                smallApartamento,
                mediumApartamento,
                largeApartamento,
                xlargeApartamento,
                rendererCasa,
                smallCasa,
                mediumCasa,
                largeCasa,
                xlargeCasa,
                rendererComercialcomResidencial,
                smallComercialcomResidencial,
                mediumComercialcomResidencial,
                largeComercialcomResidencial,
                xlargeComercialcomResidencial,
                rendererEdificioComercial,
                smallEdificioComercial,
                mediumEdificioComercial,
                largeEdificioComercial,
                xlargeEdificioComercial,
                rendererGalpao,
                smallGalpao,
                mediumGalpao,
                largeGalpao,
                xlargeGalpao,
                rendererLojaSalaConjunto,
                smallLojaSalaConjunto,
                mediumLojaSalaConjunto,
                largeLojaSalaConjunto,
                xlargeLojaSalaConjunto,
                rendererSobrado,
                smallSobrado,
                mediumSobrado,
                largeSobrado,
                xlargeSobrado
                ;

            // Add cluster renderer
            self.clusterLayerSemInformacao = new ClusterFeatureLayer({
                "url": "https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/2",
                //"url": "http://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/GlobalSeismographyNetwork/FeatureServer/0",
                // "url": "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/Since_1970/MapServer/0",
                "distance": 95,
                "id": "clusters1",
                "labelColor": "#fff",
                "resolution": map.extent.getWidth() / map.width,
                //"singleColor": "#888",
                "singleSymbol": defaultSymSemInformacao,
                "singleTemplate": infoTemplateTipologia,
                "useDefaultSymbol": false,
                "zoomOnClick": true,
                "showSingles": true,
                "objectIdField": "OBJECTID",
                "where": "de_tipologia = 'Sem Informação'",
                outFields: ["*"]
            });

            self.clusterLayerApartamento = new ClusterFeatureLayer({
                "url": "https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/2",
                //"url": "http://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/GlobalSeismographyNetwork/FeatureServer/0",
                // "url": "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/Since_1970/MapServer/0",
                "distance": 95,
                "id": "clusters2",
                "labelColor": "#fff",
                "resolution": map.extent.getWidth() / map.width,
                //"singleColor": "#888",
                "singleSymbol": defaultSymApartamento,
                "singleTemplate": infoTemplateTipologia,
                "useDefaultSymbol": false,
                "zoomOnClick": true,
                "showSingles": true,
                "objectIdField": "OBJECTID",
                "where": "de_tipologia = 'Apartamento'",
                outFields: ["*"]
            });

            self.clusterLayerCasa = new ClusterFeatureLayer({
                "url": "https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/2",
                //"url": "http://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/GlobalSeismographyNetwork/FeatureServer/0",
                // "url": "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/Since_1970/MapServer/0",
                "distance": 95,
                "id": "clusters3",
                "labelColor": "#fff",
                "resolution": map.extent.getWidth() / map.width,
                //"singleColor": "#888",
                "singleSymbol": defaultSymCasa,
                "singleTemplate": infoTemplateTipologia,
                "useDefaultSymbol": false,
                "zoomOnClick": true,
                "showSingles": true,
                "objectIdField": "OBJECTID",
                "where": "de_tipologia = 'Casa'",
                outFields: ["*"]
            });

            self.clusterLayerComercialcomResidencial = new ClusterFeatureLayer({
                "url": "https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/2",
                //"url": "http://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/GlobalSeismographyNetwork/FeatureServer/0",
                // "url": "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/Since_1970/MapServer/0",
                "distance": 95,
                "id": "clusters4",
                "labelColor": "#fff",
                "resolution": map.extent.getWidth() / map.width,
                //"singleColor": "#888",
                "singleSymbol": defaultSymComercialcomResidencial,
                "singleTemplate": infoTemplateTipologia,
                "useDefaultSymbol": false,
                "zoomOnClick": true,
                "showSingles": true,
                "objectIdField": "OBJECTID",
                "where": "de_tipologia = 'Comercial com Residencial'",
                outFields: ["*"]
            });

            self.clusterLayerEdificioComercial = new ClusterFeatureLayer({
                "url": "https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/2",
                //"url": "http://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/GlobalSeismographyNetwork/FeatureServer/0",
                // "url": "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/Since_1970/MapServer/0",
                "distance": 95,
                "id": "clusters5",
                "labelColor": "#fff",
                "resolution": map.extent.getWidth() / map.width,
                //"singleColor": "#888",
                "singleSymbol": defaultSymEdificioComercial,
                "singleTemplate": infoTemplateTipologia,
                "useDefaultSymbol": false,
                "zoomOnClick": true,
                "showSingles": true,
                "objectIdField": "OBJECTID",
                "where": "de_tipologia = 'Edificio Comercial' or de_tipologia = 'Loja_Sala_Conjunto'",
                outFields: ["*"]
            });

            self.clusterLayerGalpao = new ClusterFeatureLayer({
                "url": "https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/2",
                //"url": "http://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/GlobalSeismographyNetwork/FeatureServer/0",
                // "url": "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/Since_1970/MapServer/0",
                "distance": 95,
                "id": "clusters6",
                "labelColor": "#fff",
                "resolution": map.extent.getWidth() / map.width,
                //"singleColor": "#888",
                "singleSymbol": defaultSymGalpao,
                "singleTemplate": infoTemplateTipologia,
                "useDefaultSymbol": false,
                "zoomOnClick": true,
                "showSingles": true,
                "objectIdField": "OBJECTID",
                "where": "de_tipologia = 'Galpao'",
                outFields: ["*"]
            });

            self.clusterLayerSobrado = new ClusterFeatureLayer({
                "url": "https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/2",
                //"url": "http://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/GlobalSeismographyNetwork/FeatureServer/0",
                // "url": "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/Since_1970/MapServer/0",
                "distance": 95,
                "id": "clusters8",
                "labelColor": "#fff",
                "resolution": map.extent.getWidth() / map.width,
                //"singleColor": "#888",
                "singleSymbol": defaultSymSobrado,
                "singleTemplate": infoTemplateTipologia,
                "useDefaultSymbol": false,
                "zoomOnClick": true,
                "showSingles": true,
                "objectIdField": "OBJECTID",
                "where": "de_tipologia = 'Sobrado' or de_tipologia='Sobrado Colonial'",
                outFields: ["*"]
            });


            rendererSemInformacao = new ClassBreaksRenderer(defaultSymSemInformacao, "clusterCount");

            rendererApartamento = new ClassBreaksRenderer(defaultSymApartamento, "clusterCount");

            rendererCasa = new ClassBreaksRenderer(defaultSymCasa, "clusterCount");

            rendererComercialcomResidencial = new ClassBreaksRenderer(defaultSymComercialcomResidencial, "clusterCount");

            rendererEdificioComercial = new ClassBreaksRenderer(defaultSymEdificioComercial, "clusterCount");

            rendererGalpao = new ClassBreaksRenderer(defaultSymGalpao, "clusterCount");

            //rendererLojaSalaConjunto = new ClassBreaksRenderer(defaultSymLojaSalaConjunto, "clusterCount");

            rendererSobrado = new ClassBreaksRenderer(defaultSymSobrado, "clusterCount");

                        // Sem informação Clusters
            smallSemInformacao = new SimpleMarkerSymbol("circle", 25,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,110,180,0.5]), 15),
                        new Color([255,110,180,0.75]));
            mediumSemInformacao = new SimpleMarkerSymbol("circle", 50,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([238,106,167,0.5]), 15),
                        new Color([238,106,167,0.75]));
            largeSemInformacao = new SimpleMarkerSymbol("circle", 80,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([205,96,144,0.5]), 15),
                        new Color([205,96,144,0.75]));
            xlargeSemInformacao = new SimpleMarkerSymbol("circle", 110,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([139,58,98,0.5]), 15),
                        new Color([139,58,98,0.75]));
            // Apartamento Clusters
            smallApartamento = new SimpleMarkerSymbol("circle", 25,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([128,0,0,0.75]), 15),
                        new Color([128,0,0,0.75]));
            mediumApartamento = new SimpleMarkerSymbol("circle", 50,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([139,0,0,0.5]), 15),
                        new Color([139,0,0,0.5]));
            largeApartamento = new SimpleMarkerSymbol("circle", 80,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([205,0,0,0.5]), 15),
                        new Color([205,0,0,0.5]));
            xlargeApartamento = new SimpleMarkerSymbol("circle", 110,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([238,0,0,0.5]), 15),
                        new Color([238,0,0,0.5]));

            // Casa Clusters
            smallCasa = new SimpleMarkerSymbol("circle", 25,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,185,15,0.75]), 15),
                        new Color([255,185,15,0.75]));
            mediumCasa = new SimpleMarkerSymbol("circle", 50,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([238,173,14,0.5]), 15),
                        new Color([238,173,14,0.5]));
            largeCasa = new SimpleMarkerSymbol("circle", 80,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([205,149,12,0.5]), 15),
                        new Color([205,149,12,0.5]));
            xlargeCasa = new SimpleMarkerSymbol("circle", 110,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([139,101,8,0.5]), 15),
                        new Color([139,101,8,0.5]));

            // Comercial com Residencial Clusters
            smallComercialcomResidencial = new SimpleMarkerSymbol("circle", 25,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,245,255,0.75]), 15),
                        new Color([0,245,255,0.75]));
            mediumComercialcomResidencial = new SimpleMarkerSymbol("circle", 50,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,229,238,0.5]), 15),
                        new Color([0,229,238,0.5]));
            largeComercialcomResidencial = new SimpleMarkerSymbol("circle", 80,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,197,205,0.5]), 15),
                        new Color([0,197,205,0.5]));
            xlargeComercialcomResidencial = new SimpleMarkerSymbol("circle", 110,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,134,139,0.5]), 15),
                        new Color([0,134,139,0.5]));

            // Edificio Comercial Clusters
            smallEdificioComercial = new SimpleMarkerSymbol("circle", 25,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([155,48,255,0.75]), 15),
                        new Color([155,48,255,0.75]));
            mediumEdificioComercial = new SimpleMarkerSymbol("circle", 50,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([145,44,238,0.5]), 15),
                        new Color([145,44,238,0.5]));
            largeEdificioComercial = new SimpleMarkerSymbol("circle", 80,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([125,38,205,0.5]), 15),
                        new Color([125,38,205,0.5]));
            xlargeEdificioComercial = new SimpleMarkerSymbol("circle", 110,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([85,26,139,0.5]), 15),
                        new Color([85,26,139,0.5]));

            // Galpao Clusters
            smallGalpao = new SimpleMarkerSymbol("circle", 25,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([193,255,193,0.75]), 15),
                        new Color([193,255,193,0.75]));
            mediumGalpao = new SimpleMarkerSymbol("circle", 50,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([180,238,180,0.5]), 15),
                        new Color([180,238,180,0.5]));
            largeGalpao = new SimpleMarkerSymbol("circle", 80,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([155,205,155,0.5]), 15),
                        new Color([155,205,155,0.5]));
            xlargeGalpao = new SimpleMarkerSymbol("circle", 110,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([105,139,105,0.5]), 15),
                        new Color([105,139,105,0.5]));


            // // Loja Sala Conjunto Clusters
            // smallLojaSalaConjunto = new SimpleMarkerSymbol("circle", 25,
            //             new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([65,105,225,0.75]), 15),
            //             new Color([65,105,225,0.75]));
            // mediumLojaSalaConjunto = new SimpleMarkerSymbol("circle", 50,
            //             new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([72,118,255,0.5]), 15),
            //             new Color([72,118,255,0.5]));
            // largeLojaSalaConjunto = new SimpleMarkerSymbol("circle", 80,
            //             new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([67,110,238,0.5]), 15),
            //             new Color([67,110,238,0.5]));
            // xlargeLojaSalaConjunto = new SimpleMarkerSymbol("circle", 110,
            //             new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([58,95,205,0.5]), 15),
            //             new Color([58,95,205,0.5]));

            // Loja Sala Conjunto Clusters
            smallSobrado = new SimpleMarkerSymbol("circle", 25,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,139,0,0.75]), 15),
                        new Color([0,139,0,0.75]));
            mediumSobrado = new SimpleMarkerSymbol("circle", 50,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,128,0,0.5]), 15),
                        new Color([0,128,0,0.5]));
            largeSobrado = new SimpleMarkerSymbol("circle", 80,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,100,0,0.5]), 15),
                        new Color([0,100,0,0.5]));
            xlargeSobrado = new SimpleMarkerSymbol("circle", 110,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([48,128,20,0.5]), 15),
                        new Color([48,128,20,0.5]));

            // Break values - can adjust easily
            rendererSemInformacao.addBreak(2, 10, smallSemInformacao);
            rendererSemInformacao.addBreak(11, 25, mediumSemInformacao);
            rendererSemInformacao.addBreak(26, 46, largeSemInformacao);
            rendererSemInformacao.addBreak(47, 50000, xlargeSemInformacao);

            rendererApartamento.addBreak(2, 10, smallApartamento);
            rendererApartamento.addBreak(11, 25, mediumApartamento);
            rendererApartamento.addBreak(100, 150, largeApartamento);
            rendererApartamento.addBreak(150, 50000, xlargeApartamento);

            rendererCasa.addBreak(2, 10, smallCasa);
            rendererCasa.addBreak(11, 25, mediumCasa);
            rendererCasa.addBreak(100, 150, largeCasa);
            rendererCasa.addBreak(150, 50000, xlargeCasa);

            rendererComercialcomResidencial.addBreak(2, 10, smallComercialcomResidencial);
            rendererComercialcomResidencial.addBreak(11, 25, mediumComercialcomResidencial);
            rendererComercialcomResidencial.addBreak(100, 150, largeComercialcomResidencial);
            rendererComercialcomResidencial.addBreak(150, 50000, xlargeComercialcomResidencial);

            rendererEdificioComercial.addBreak(2, 10, smallEdificioComercial);
            rendererEdificioComercial.addBreak(11, 25, mediumEdificioComercial);
            rendererEdificioComercial.addBreak(100, 150, largeEdificioComercial);
            rendererEdificioComercial.addBreak(150, 50000, xlargeEdificioComercial);

            rendererGalpao.addBreak(2, 10, smallGalpao);
            rendererGalpao.addBreak(11, 25, mediumGalpao);
            rendererGalpao.addBreak(100, 150, largeGalpao);
            rendererGalpao.addBreak(150, 50000, xlargeGalpao);

            // rendererLojaSalaConjunto.addBreak(2, 10, smallLojaSalaConjunto);
            // rendererLojaSalaConjunto.addBreak(11, 25, mediumLojaSalaConjunto);
            // rendererLojaSalaConjunto.addBreak(100, 150, largeLojaSalaConjunto);
            // rendererLojaSalaConjunto.addBreak(150, 50000, xlargeLojaSalaConjunto);

            rendererSobrado.addBreak(2, 10, smallSobrado);
            rendererSobrado.addBreak(11, 25, mediumSobrado);
            rendererSobrado.addBreak(100, 150, largeSobrado);
            rendererSobrado.addBreak(150, 50000, xlargeSobrado);




            // Providing a ClassBreakRenderer is also optional
            self.clusterLayerSemInformacao.setRenderer(rendererSemInformacao);
            self.clusterLayerApartamento.setRenderer(rendererApartamento);
            self.clusterLayerCasa.setRenderer(rendererCasa);
            self.clusterLayerComercialcomResidencial.setRenderer(rendererComercialcomResidencial);
            self.clusterLayerEdificioComercial.setRenderer(rendererEdificioComercial);
            self.clusterLayerGalpao.setRenderer(rendererGalpao);
            self.clusterLayerSobrado.setRenderer(rendererSobrado);
            map.addLayer(self.clusterLayerSemInformacao);
            map.addLayer(self.clusterLayerApartamento);
            map.addLayer(self.clusterLayerCasa);
            map.addLayer(self.clusterLayerComercialcomResidencial);
            map.addLayer(self.clusterLayerEdificioComercial);
            map.addLayer(self.clusterLayerGalpao);
            map.addLayer(self.clusterLayerSobrado);
        }


        // // Create new graphic and add to map.graphics
        // function addSelectedFeature() {
        //     var selIndex = map.infoWindow.selectedIndex,
        //     selFeature;
        //     if (selIndex !== -1) {
        //         selFeature = map.infoWindow.features[selIndex];
        //         // Remove old feature first
        //         removeSelectedFeature();
        //         // Add new graphic
        //         map.infoWindow._lastSelected = new Graphic(selFeature.toJson());
        //         map.infoWindow._lastSelected.setSymbol(selectedSym1. selectedSym2);
        //         map.graphics.add(map.infoWindow._lastSelected);
        //     }
        // }

        

        

        //Hide popup if selected feature is clustered
        // function onClustersShown(clusters1, clusters2) {
        //     var  i = 0,
        //         extent;
        //     if (map.infoWindow.isShowing && map.infoWindow._lastSelected) {
        //         for (i; i < clusters.length; i++) {
        //             if (clusters[i].attributes.clusterCount > 1) {
        //                 extent = clusterPredial._getClusterExtent(clusters[i]);
        //                 if (extent.contains(map.infoWindow._lastSelected.geometry)) {
        //                     map.infoWindow.hide();
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        // }

        // Wire cluster layer events
        function addClusterLayerEvents() {
            // Mouse over events
            self.clusterLayerSemInformacao.on("mouse-over", onMouseOverCluster);
            self.clusterLayerSemInformacao.on("mouse-out", onMouseOutCluster);
            self.clusterLayerApartamento.on("mouse-over", onMouseOverCluster);
            self.clusterLayerApartamento.on("mouse-out", onMouseOutCluster);
            self.clusterLayerCasa.on("mouse-over", onMouseOverCluster);
            self.clusterLayerCasa.on("mouse-out", onMouseOutCluster);
            self.clusterLayerComercialcomResidencial.on("mouse-over", onMouseOverCluster);
            self.clusterLayerComercialcomResidencial.on("mouse-out", onMouseOutCluster);
            self.clusterLayerEdificioComercial.on("mouse-over", onMouseOverCluster);
            self.clusterLayerEdificioComercial.on("mouse-out", onMouseOutCluster);
            self.clusterLayerGalpao.on("mouse-over", onMouseOverCluster);
            self.clusterLayerGalpao.on("mouse-out", onMouseOutCluster);
            self.clusterLayerSobrado.on("mouse-over", onMouseOverCluster);
            self.clusterLayerSobrado.on("mouse-out", onMouseOutCluster);
            // Clusters drawn
            // clusterLayerSemInformacao.on("clusters-shown", onClustersShown);
            // clusterLayerApartamento.on("clusters-shown", onClustersShown);
            // clusterLayerCasa.on("clusters-shown", onClustersShown);
            // clusterLayerComercialcomResidencial.on("clusters-shown", onClustersShown);
            // clusterLayerEdificioComercial.on("clusters-shown", onClustersShown);
            // clusterLayerGalpao.on("clusters-shown", onClustersShown);
            // clusterLayerSobrado.on("clusters-shown", onClustersShown);
        }

        // Save the last selected graphic so we can highlight it
      //   map.infoWindow.on("selection-change", function () {
      //       addSelectedFeature();
      //      // animateInfoWindow();
      //  });

      //   // Clear selected graphic when infoWindow is hidden
      //   map.infoWindow.on("hide", function () {
      //       // re-activate cluster
      //       setActiveClusterOpacity(activeClusterElement, 0.75, 0.5);
      //       removeSelectedFeature();
      //   });


        // Popup enhancements
        function onMouseOverCluster(e) {
            if (e.graphic.attributes.clusterCount === 1) {
                e.graphic._graphicsLayer.onClick(e);
            } else {
                if (e.target.nodeName === "circle") {
                    self.activeClusterElement = e.target;
                    self.setActiveClusterOpacity(self.activeClusterElement, 1, 1);
                } else {
                    self.setActiveClusterOpacity(self.activeClusterElement, 1, 1);
                }
            }
        }

        function onMouseOutCluster(e) {
            if (e.graphic.attributes.clusterCount > 1) {
                if (e.target.nodeName === "circle" || e.target.nodeName === "text") {
                    self.setActiveClusterOpacity(self.activeClusterElement, 0.75, 0.5);
                    self.setActiveClusterOpacity(e.target, 0.75, 0.5);
                }
            }
        }

             // Click to close
        map.on('click', function () {
            if (map.infoWindow.isShowing) {
                map.infoWindow.hide();
            }
        });

        // ESC is pressed
        map.on('key-down', function (e) {
            if (e.keyCode === 27) {
                map.infoWindow.hide();
            }
        });

        // Dynamically reposition popups when map moves
        map.on('extent-change', function () {
            if (map.infoWindow.isShowing) {
                map.infoWindow.reposition();
            }
        });
    },


  // Highlight clusters
  setActiveClusterOpacity: function (elem, fillOpacity, strokeOpacity) {
    var textElm;
    if (elem) {
        elem.setAttribute("fill-opacity", fillOpacity);
        elem.setAttribute("stroke-opacity", strokeOpacity);
                // Overide inherited properties for the text in the circle
                textElm = elem.nextElementSibling;
                if (textElm && textElm.nodeName === "text") {
                    textElm.setAttribute("fill-opacity", 1);
                }
            }
        },

        addTerritorial: function() {
            console.log(self.clusterTerritorialWasCreated)
            if(self.clusterTerritorialWasCreated){
                
            if(self.isShowingCluster){
                self.clusterPredial.hide();
                self.clusterTerritorial.hide();
                self.isShowingCluster= false;
            }else{
                self.clusterPredial.show();
                self.clusterTerritorial.show();
                self.isShowingCluster=true;
            }
        }else{
            self.clusterTerritorialWasCreated = true;
            self.showClusterTerritorial();
        }
            

        },
         addTipologia: function() {
            if(self.clusterde_tipologiaWasCreated){
                
            if(self.isShowingClusterde_tipologia){
            self.clusterLayerSemInformacao.hide();
            self.clusterLayerApartamento.hide();
            self.clusterLayerCasa.hide();
            self.clusterLayerComercialcomResidencial.hide();
            self.clusterLayerEdificioComercial.hide();
            self.clusterLayerGalpao.hide();
            //self.clusterLayerLojaSalaConjunto.hide();
            self.clusterLayerSobrado.hide();
                self.isShowingClusterde_tipologia= false;
            }else{
            self.clusterLayerSemInformacao.show();
            self.clusterLayerApartamento.show();
            self.clusterLayerCasa.show();
            self.clusterLayerComercialcomResidencial.show();
            self.clusterLayerEdificioComercial.show();
            self.clusterLayerGalpao.show();
            //self.clusterLayerLojaSalaConjunto.show();
            self.clusterLayerSobrado.show();
                self.isShowingClusterde_tipologia=true;
            }

        }else{
            self.clusterde_tipologiaWasCreated = true;
            self.showClusterde_tipologia();
        }

    }

    });
        return clazz;

    });
