/**
 * Parse LiDar data (stored in velodyne_points dir),
 */

function loadLidarData(uint8Array, pointSize) {
  /*
    Data Fields:
    datatypes (http://docs.ros.org/api/sensor_msgs/html/msg/PointField.html)
      4: uint16
      7: float32
    [
      { name: 'x', offset: 0, datatype: 7, count: 1 },
      { name: 'y', offset: 4, datatype: 7, count: 1 },
      { name: 'z', offset: 8, datatype: 7, count: 1 },
      { name: 'intensity', offset: 16, datatype: 7, count: 1 },
      { name: 'ring', offset: 20, datatype: 4, count: 1 }
    ]
   */
  const pointsCount = uint8Array.length / pointSize;
  const buf = Buffer.from(uint8Array); // eslint-disable-line

  // We could return interleaved buffers, no conversion!
  const positions = new Float32Array(3 * pointsCount);
  const reflectance = new Float32Array(pointsCount);

  for (let i = 0; i < pointsCount; i++) {
    positions[i * 3 + 0] = buf.readFloatLE(i * pointSize);
    positions[i * 3 + 1] = buf.readFloatLE(i * pointSize + 4);
    positions[i * 3 + 2] = buf.readFloatLE(i * pointSize + 8);
    reflectance[i] = buf.readFloatLE(i * pointSize + 16);
  }
  return {positions, reflectance};
}

module.exports = {
  loadLidarData
};
