"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.sessionModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../conn/connection");
const constants_1 = require("../constants/constants");
const userModel = connection_1.sequelize.define(constants_1.TableNames.USERS, {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, { timestamps: false });
exports.userModel = userModel;
const sessionModel = connection_1.sequelize.define(constants_1.TableNames.SESSION, {
    sid: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    expire: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: constants_1.TableNames.SESSION,
    timestamps: false,
});
exports.sessionModel = sessionModel;
