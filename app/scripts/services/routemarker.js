'use strict';

/**
 * @ngdoc service
 * @name angsmpApp.RouteMarker
 * @description
 * # RouteMarker
 * Service in the angsmpApp.
 */
angular.module('angsmpApp')
  .service('RouteMarker', ['uiGmapLogger', function ($log) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    $log.currentLevel = $log.LEVELS.debug;  // ログレベルの設定
    this.models = [];         // マーカー格納エリア
    this.modelsByGenId = [];  // IDからの参照用マーカー格納エリア
    this.nextid = 1;          // ID値

    // マーカーID生成
    this.genId = function () {
      return 'sample-' + (this.nextid++);
    };

    // マーカー生成（位置情報のみ）
    this.genMarker = function (genid, lat, lng) {
      var genmarker = {
        id: genid,
        latitude: lat,
        longitude: lng,
        title: genid
      };
      return genmarker;
    };

    // マーカー追加
    this.addMarker = function (lat, lng) {
      var genid = this.genId();
      var genmarker = this.genMarker(genid, lat, lng);
      $log.debug('create marker:' + genid);
      this.models.push(genmarker);
      this.modelsByGenId[genid] = genmarker;
      $log.debug(this.models);
    };

    // マーカー挿入
    this.insMarker = function (id, lat, lng, prev) {
      var genid;
      var genmarker;

      // 挿入位置捜索
      for (var i = 0; i < this.models.length; i++) {
        if (this.models[i].id === id) {
          // 挿入位置発見、マーカー作成
          genid = this.genId();
          genmarker = this.genMarker(genid, lat, lng);
          if (prev === true) {
            // 直前に挿入の場合
            this.modelsByGenId[genid] = genmarker;
            this.models.splice(i, 0, genmarker);
          }
          else {
            // 直後に挿入の場合
            if (i === (this.models.length - 1)) {
              // 最終位置なら末尾に追加
              this.modelsByGenId[genid] = genmarker;
              this.models.push(genmarker);
            }
            else {
              // 最終位置でなければ直後のマーカーの直前に挿入
              this.modelsByGenId[genid] = genmarker;
              this.models.splice(i + 1, 0, genmarker);
            }
          }
          break;
        }
      }
    };

    // マーカー格納エリア返却
    this.getModel = function () {
      return this.models;
    };

    // マーカー情報取得
    this.getMarker = function (id) {
      return this.modelsByGenId[id];
    };

    // モデル格納順マーカー情報取得(順方向)
    this.nextMarker = function (id) {
      if (id === '') {
        if (this.models.length > 0) {
          return this.models[0];
        }
      }
      else {
        for (var i = 0; i < this.models.length; i++) {
          if (this.models[i].id === id) {
            if (i === (this.models.length - 1)) {
              return undefined;
            }
            else {
              return this.models[i + 1];
            }
          }
        }
      }
      return undefined;
    };

    // モデル格納順マーカー情報取得(逆方向)
    this.prevMarker = function (id) {
      if (id === '') {
        if (this.models.length > 0) {
          return this.models[this.models.length - 1];
        }
      }
      else {
        for (var i = 0; i < this.models.length; i++) {
          if (this.models[i].id === id) {
            if (i === 0) {
              return undefined;
            }
            else {
              return this.models[i - 1];
            }
          }
        }
      }
      return undefined;
    };

    // マーカー情報削除
    this.deleteMarker = function (id) {
      // ID参照用配列から削除
      delete this.modelsByGenId[id];
      // 削除対象の位置捜索
      for (var i = 0; i < this.models.length; i++) {
        if (this.models[i].id === id) {
          // 削除対象発見、配列から削除
          this.models.splice(i, 1);
          break;
        }
      }
    };
  }]);
