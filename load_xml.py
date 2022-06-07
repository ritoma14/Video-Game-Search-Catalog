#!/usr/bin/python3

import xml.etree.ElementTree as ET
import psycopg2

class loadDatabase:

    def __init__(self, connect_str):    
        self.conn = psycopg2.connect(connect_str);
    
    def load(self, xmlFile):
        xmlTree = ET.parse(xmlFile);
        root = xmlTree.getroot();

        for cdEle in root.findall('row'):
            sql = self._getSql(cdEle);
            self._execute(sql);

    def _getSql(self, cdEle):
        name = cdEle.find('name').text.replace("'", "''");
        platform = cdEle.find('platform').text.replace("'", "''");
        release_date = cdEle.find('release_date').text.replace("'", "''");
        meta_score = cdEle.find('meta_score').text.replace("'", "''");
        user_review = cdEle.find('user_review').text.replace("'", "''");
        
        insert_games = "INSERT INTO games(name, platform, release_date, meta_score, user_review) VALUES('{0}', '{1}', '{2}', '{3}', '{4}')".format(name, platform, release_date, meta_score, user_review);

        return insert_games;

    def _execute(self, sql):
        cursor = self.conn.cursor();
        try:
            cursor.execute(sql);
        except psycopg2.Error as e:
            print("Database error occured during execution '",sql,"'");
            print(e.diag.message_primary);      
        self.conn.commit();
        cursor.close();


if __name__ == "__main__":
    connect_str = "dbname='video_catalog' user='ramy' host='localhost' password=''";
    xmlFile = "./all_games.xml";
    dbLoader = loadDatabase(connect_str);
    dbLoader.load(xmlFile);


