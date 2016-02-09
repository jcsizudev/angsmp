'use strict';

/**
 * @ngdoc function
 * @name angsmpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angsmpApp
 */
angular.module('angsmpApp')
  .controller('MainCtrl', [ '$scope', '$timeout', 'uiGmapLogger', 'RouteMarker', 'uiGmapGoogleMapApi', function ($scope, $timeout, $log, RouteMarker, GoogleMapApi) {
    $log.currentLevel = $log.LEVELS.debug;  // ログレベルの設定
    $scope.test = 'set';  // テスト動作確認用

    // google mapの準備完了待ち
    GoogleMapApi.then(function(maps) {
      // スコープのセットアップ
      angular.extend($scope, {
        // マップ操作用スコープ
        map: {
          // 初期位置
          center: {
            latitude: 35.687487,
            longitude: 139.764280
          },
          // ズーム
          zoom: 14,
          // マップイベント定義
          events: {
            // 地図画像ロード
            tilesloaded: function (map, eventName, orgEv) {
              $log.debug(eventName);
              $log.debug(orgEv);
            },
            // 地図クリック
            click: function (mapModel, eventName, orgEv) {
              $log.debug('map:' + eventName);
              $log.debug(orgEv);

              // クリック位置にマーカーを追加
              if ($scope.markers.markerMode) {
                RouteMarker.addMarker(orgEv[0].latLng.lat(), orgEv[0].latLng.lng());
                $scope.$evalAsync();
              }
            },
            center_changed: function (mapModel, eventName, orgEv) {
              $log.debug('center_changed!');
              if ($scope.markers.currentWalk !== '') {
                // ルート移動中ならば次のマーカーへ移動
                var mkr = RouteMarker.nextMarker($scope.markers.currentWalk);
                if (mkr !== undefined) {
                  $scope.markers.currentWalk = mkr.id;
                  $timeout(function () {
                    $scope.map.getGMap().panTo(new maps.LatLng(mkr.latitude,mkr.longitude));
                  }, 1000);
                }
                else {
                  $scope.markers.currentWalk = '';
                }
              }
            }
          }
        },
        // マーカー操作用スコープ
        markers: {
          // ルートマーカーのマーカー配列をモデルとする。
          models: RouteMarker.getModel(),
          // ドラッグ可能
          options: {
            draggable: true
          },
          // イベント定義
          events: {
            // ドラッグ開始
            dragstart: function (marker, eventName, args) {
              $log.debug('marker:' + eventName);
            },
            // ドラッグ中
            drag: function (marker, eventName, args) {
              $log.debug('marker:' + eventName);
              // ドラッグ位置でモデルのマーカーを更新
              var curMarker = RouteMarker.getMarker(marker.key);
              curMarker.latitude = marker.getPosition().lat();
              curMarker.longitude = marker.getPosition().lng();
            },
            // ドラッグ終了
            dragend: function (marker, eventName, args) {
              $log.debug('marker:' + eventName);
            },
            // マーカーをクリック
            click: function (marker, eventName, args) {
              $log.debug('marker:' + eventName);
              $log.debug(marker);

              // 対象マーカーを保存、バウンスアニメーションを設定
              $scope.markers.dialogTarget = marker;
              marker.setAnimation(maps.Animation.BOUNCE);

              // ダイアログの表示値（緯度経度）を設定して、ダイアログをモーダル表示
              $('#dlgLatitude').text(marker.getPosition().lat());
              $('#dlgLongitude').text(marker.getPosition().lng());
              $('#markerModal').modal();
            }
          },
          // ダイアログ選択中マーカー保存用
          dialogTarget: undefined,
          // マーカー挿入時の位置情報作成
          calcNewMarkerPos: function (sw, ne, mkp, cp) {
            var xdir;
            var ydir;
            var xlen;
            var ylen;
            // マーカー配置方向決定
            if (cp.lat() > mkp.lat()) {
              ydir = -1.0;
            }
            else {
              ydir = 1.0;
            }
            if (cp.lng() > mkp.lng()) {
              xdir = -1.0;
            }
            else {
              xdir = 1.0;
            }

            // マーカー配置距離設定
            ylen = (sw.lat() - ne.lat()) / 20.0;
            xlen = (sw.lng() - ne.lng()) / 20.0;

            // 緯度経度オブジェクトを作成
            var newMkp = {
              latitude: mkp.lat() + (ylen * ydir),
              longitude: mkp.lng() + (xlen * xdir)
            };

            return newMkp;
          },
          // マーカー挿入
          insertNewMarker: function (markerKey, markerPos, prevInsert) {
            var posInfo = $scope.markers.calcNewMarkerPos(
              $scope.map.getGMap().getBounds().getSouthWest(),
              $scope.map.getGMap().getBounds().getNorthEast(),
              markerPos,
              $scope.map.getGMap().getCenter()
            );
            RouteMarker.insMarker(
              markerKey,
              posInfo.latitude,
              posInfo.longitude,
              prevInsert
            );
          },
          // マーカー配置モード
          markerMode: false,
          markerModeName: 'ブラウズ',
          clickToggle: function () {
            $log.debug('Toggle!');
            if ($scope.markers.markerMode) {
              $scope.markers.markerModeName = 'ブラウズ';
              $scope.markers.markerMode = false;
            }
            else {
              $scope.markers.markerModeName = 'マーカー配置';
              $scope.markers.markerMode = true;
            }
          },
          // ルートに沿って移動
          currentWalk: '',
          walkRoute: function () {
            var mkr = RouteMarker.nextMarker($scope.markers.currentWalk);
            if (mkr !== undefined) {
              $scope.markers.currentWalk = mkr.id;
              $scope.map.getGMap().panTo(new maps.LatLng(mkr.latitude,mkr.longitude));
            }
          }
        },
        // マーカーを結ぶ線分表示用スコープ
        polyline: {
          // モデルをマーカー配列と共有する
          path: RouteMarker.getModel(),
          // 線の描画情報
          stroke: {
            color: '#6060FB',
            weight: 3
          },
          // マーカー操作で編集させるため、編集はオプションは不可を設定
          editable: false,
          // マーカー操作で編集させるため、ドラッグオプションも不可を設定
          draggable: false,
          geodesic: true,
          visible: true,
          icons: [
            {
              icon: {
                path: maps.CIRCLE
              }
            }
          ]
        },
        // グリッド操作用スコープ：ルートマーカーのマーカー配列をモデルとする。
        gridOptions: {
          enableGridMenu: true,
          gridMenuCustomItems: [
            {
              title: '選択したマーカーを削除',
              action: function (event) {
                $log.debug('GridMenu-delete');
                if ($scope.gridApi.selection !== undefined) {
                  var selected = $scope.gridApi.selection.getSelectedRows();
                  for (var i = 0; i < selected.length; i++) {
                    RouteMarker.deleteMarker(selected[i].id);
                  }
                  $scope.gridApi.selection.clearSelectedRows();
                  $scope.$evalAsync();
                }
              },
              order: 2
            },
            {
              title: '選択マーカーの直前にマーカーを挿入',
              action: function (event) {
                $log.debug('GridMenu-ins-prev');
                if ($scope.gridApi.selection !== undefined) {
                  var selected = $scope.gridApi.selection.getSelectedRows();
                  if (selected.length > 0) {
                    var mkp = new maps.LatLng(selected[0].latitude, selected[0].longitude);
                    $scope.markers.insertNewMarker(selected[0].id, mkp, true);
                    $scope.$evalAsync();
                  }
                }
              },
              order: 3
            },
            {
              title: '選択マーカーの直後にマーカーを挿入',
              action: function (event) {
                $log.debug('GridMenu-ins-next');
                if ($scope.gridApi.selection !== undefined) {
                  var selected = $scope.gridApi.selection.getSelectedRows();
                  if (selected.length > 0) {
                    var mkp = new maps.LatLng(selected[0].latitude, selected[0].longitude);
                    $scope.markers.insertNewMarker(selected[0].id, mkp, false);
                    $scope.$evalAsync();
                  }
                }
              },
              order: 4
            },
            {
              title: '末尾にマーカーを追加',
              action: function (event) {
                $log.debug('GridMenu-add');
                var mdl = RouteMarker.prevMarker('');
                var pos = {};
                if (mdl === undefined) {
                  pos = $scope.map.getGMap().getCenter();
                  RouteMarker.addMarker(pos.lat(), pos.lng());
                }
                else {
                  pos = new maps.LatLng(mdl.latitude, mdl.longitude);
                  $scope.markers.insertNewMarker(mdl.id, pos, false);
                }
                $scope.$evalAsync();
              },
              order: 5
            }
          ],
          gridMenuShowHideColumns: false,
          data: RouteMarker.getModel(),
          columnDefs: [
            {name: 'id', displayName: 'ID', visible: false},
            {name: 'title', displayName: 'ラベル', enableCellEdit: true},
            {name: 'latitude', displayName: '緯度', enableCellEdit: true},
            {name: 'longitude', displayName: '経度', enableCellEdit: true}
          ],
          enableCellEditOnFocus: true,
          multiSelect: false,
          onRegisterApi: function (gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
              $log.debug('row selection changed!');
              $log.debug(row);
              $scope.gridApi = gridApi;
              $scope.map.getGMap().panTo(new maps.LatLng(row.entity.latitude,row.entity.longitude));
            });
          }
        },
        gridApi: {}
      });

      // ダイアログ操作のイベント定義
      // 削除ボタンイベント
      $('#dlgDelBtn').on('click', function (e) {
        $log.debug('dlgDelBtn-click!');
        if ($scope.markers.dialogTarget !== undefined) {
          RouteMarker.deleteMarker($scope.markers.dialogTarget.key);
          $scope.$evalAsync();
          $('#markerModal').modal('hide');
        }
      });

      // マーカー挿入（前）イベント
      $('#dlgInsPrev').on('click', function (e) {
        $log.debug('dlgInsPrev-click!');
        if ($scope.markers.dialogTarget !== undefined) {
          $scope.markers.insertNewMarker(
            $scope.markers.dialogTarget.key,
            $scope.markers.dialogTarget.getPosition(),
            true
          );
          $scope.$evalAsync();
          $('#markerModal').modal('hide');
        }
      });

      // マーカー挿入（後）イベント
      $('#dlgInsNext').on('click', function (e) {
        $log.debug('dlgInsNext-click!');
        if ($scope.markers.dialogTarget !== undefined) {
          $scope.markers.insertNewMarker(
            $scope.markers.dialogTarget.key,
            $scope.markers.dialogTarget.getPosition(),
            false
          );
          $scope.$evalAsync();
          $('#markerModal').modal('hide');
        }
      });

      // ダイアログ非表示時のイベント
      $('#markerModal').on('hide.bs.modal', function (e) {
        $log.debug( 'Hide dialog.' );
        if ($scope.markers.dialogTarget !== undefined) {
          $scope.markers.dialogTarget.setAnimation(null);
          $scope.markers.dialogTarget = undefined;
        }
      });

    });
  }]);
