/******************************************************************************
 *
 * Copyright (c) 2017, the Perspective Authors.
 *
 * This file is part of the Perspective library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */

var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
var now = new Date();

var data = [
    {'w': now, 'x': 1, 'y':'a', 'z': true},
    {'w': now, 'x': 2, 'y':'b', 'z': false},
    {'w': now, 'x': 3, 'y':'c', 'z': true},
    {'w': yesterday, 'x': 4, 'y':'d', 'z': false}
];

var rdata = [
    {'w': +now, 'x': 1, 'y':'a', 'z': true},
    {'w': +now, 'x': 2, 'y':'b', 'z': false},
    {'w': +now, 'x': 3, 'y':'c', 'z': true},
    {'w': +yesterday, 'x': 4, 'y':'d', 'z': false}
];

module.exports = (perspective) => {

    describe("Filters", function() {

        describe("GT & LT", function() {

            it("filters on long strings", async function () {
                var table = perspective.table([
                    {'x': 1, 'y':'123456789012a', 'z': true},
                    {'x': 2, 'y':'123456789012a', 'z': false},
                    {'x': 3, 'y':'123456789012b', 'z': true},
                    {'x': 4, 'y':'123456789012b', 'z': false}
                ]);
                var view = table.view({
                    filter: [["y", "contains", "123456789012a"]]
                });
                let json = await view.to_json();
                expect(json.length).toEqual(2);

            });

            it("x > 2", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['x', '>', 2.0]]
                });
                let json = await view.to_json();
                expect(rdata.slice(2)).toEqual(json);
            });

            it("x < 3", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['x', '<', 3.0]]
                });
                let json = await view.to_json();
                expect(rdata.slice(0, 2)).toEqual(json);
            });

            it("x > 4", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['x', '>', 4]]
                });
                let json = await view.to_json();
                expect([]).toEqual(json);
            });

            it("x < 0", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['x', '>', 4]]
                });
                let json = await view.to_json();
                expect([]).toEqual(json);
            });

        });

        describe("EQ", function() {

            it("x == 1", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['x', '==', 1]]
                });
                let json = await view.to_json();
                expect(rdata.slice(0, 1)).toEqual(json);
            });

            it("x == 5", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['x', '==', 5]]
                });
                let json = await view.to_json();
                expect([]).toEqual(json);
            });

            it("y == 'a'", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['y', '==', 'a']]
                });
                let json = await view.to_json();
                expect(rdata.slice(0, 1)).toEqual(json);
            });

            it("y == 'e'", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['y', '==', 'e']]
                });
                let json = await view.to_json();
                expect([]).toEqual(json);
            });

            it("z == true", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['z', '==', true]]
                });
                let json = await view.to_json();
                expect([rdata[0], rdata[2]]).toEqual(json);
            });

            it("z == false", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['z', '==', false]]
                });
                let json = await view.to_json();
                expect([rdata[1], rdata[3]]).toEqual(json);
            });

            it("w == yesterday", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['w', '==', yesterday]]
                });
                let json = await view.to_json();
                expect([rdata[3]]).toEqual(json);
            });

            it("w != yesterday", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['w', '!=', yesterday]]
                });
                let json = await view.to_json();
                expect(rdata.slice(0, 3)).toEqual(json);
            });
        });

        describe("in", function() {
            it("y in ['a', 'b']", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['y', 'in', ['a', 'b']]]
                });
                let json = await view.to_json();
                expect(rdata.slice(0, 2)).toEqual(json);
            });

        });

        describe("contains", function() {

            it("y contains 'a'", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [['y', 'contains', 'a']]
                });
                let json = await view.to_json();
                expect(rdata.slice(0, 1)).toEqual(json);
            });

        });

        describe("multiple", function() {

            it("x > 1 & x < 4", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter: [
                        ['x', '>', 1],
                        ['x', '<', 4]
                    ]
                });
                let json = await view.to_json();
                expect(rdata.slice(1, 3)).toEqual(json);
            });

            it("y contains 'a' | y contains 'b'", async function () {
                var table = perspective.table(data);
                var view = table.view({
                    filter_op: "|",
                    filter: [
                        ['y', 'contains', 'a'],
                        ['y', 'contains', 'b']
                    ]
                });
                let json = await view.to_json();
                expect(rdata.slice(0, 2)).toEqual(json);
            });

        });

    });


};

