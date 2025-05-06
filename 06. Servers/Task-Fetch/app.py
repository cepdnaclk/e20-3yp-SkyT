from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from datetime import datetime, time, timedelta
import json
from config import Config 

app = Flask(__name__)
app.config.from_object(Config)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route('/task/<droneId>')
def get_task_for_drone(droneId):
    try:
        # Get drone info
        drone_query = text("SELECT type, estateId FROM DRONES WHERE droneId = :droneId")
        drone = db.session.execute(drone_query, {'droneId': droneId}).fetchone()

        if not drone:
            return jsonify({'status': 'error', 'message': f'Drone ID {droneId} not found'}), 404

        drone_type, estate_id = drone

        # Get matching tasks
        task_query = text("""
            SELECT lots, dueDate, dueTime
            FROM TASKS
            WHERE tag = :tag AND status = 'Pending' AND estateId = :estateId
        """)
        tasks = db.session.execute(task_query, {'tag': drone_type, 'estateId': estate_id}).fetchall()

        if not tasks:
            return jsonify({'status': 'error', 'message': 'No matching pending tasks found'}), 404

        now = datetime.now()

        # Select closest task by due date + time
        def combined_due_datetime(row):
            due_date = row[1]
            due_time = row[2]

            if isinstance(due_time, timedelta):
                total_seconds = int(due_time.total_seconds())
                hours = total_seconds // 3600
                minutes = (total_seconds % 3600) // 60
                seconds = total_seconds % 60
                due_time = time(hour=hours, minute=minutes, second=seconds)

            return datetime.combine(due_date, due_time)

        closest_task = min(tasks, key=lambda row: abs(combined_due_datetime(row) - now))
        lots_json = closest_task[0]

        # Parse lot IDs
        lot_ids = json.loads(lots_json) if isinstance(lots_json, str) else lots_json
        if not lot_ids:
            return jsonify({'status': 'error', 'message': 'No lot IDs found in task'}), 404

        lot_info_list = []

        for lot_id in lot_ids:
            # Step 5a: Get lot location
            lot_query = text("SELECT lat, lng FROM LOTS WHERE lotId = :lotId")
            lot_result = db.session.execute(lot_query, {'lotId': lot_id}).fetchone()

            if not lot_result:
                continue

            lot_lat, lot_lng = lot_result

            # Get nodes in the lot
            nodes_query = text("""
                SELECT nodeId, lat, lng FROM NODES WHERE lotId = :lotId
            """)
            nodes = db.session.execute(nodes_query, {'lotId': lot_id}).fetchall()

            node_data = [
                {'nodeId': node[0], 'lat': node[1], 'lng': node[2]}
                for node in nodes
            ]

            lot_info_list.append({
                'lotId': lot_id,
                'lat': lot_lat,
                'lng': lot_lng,
                'nodes': node_data
            })

        return jsonify({
            'status': 'success',
            'droneId': droneId,
            'lots': lot_info_list
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5001)
