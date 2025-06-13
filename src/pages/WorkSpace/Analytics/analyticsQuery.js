export const analyticsQuery = (fromDate, toDate) => {

    return [
        {
            "$match": {
                "type": "spa_appointment",
                "$expr": {
                    "$and": [
                        {
                            "$gte": [
                                "$duration.start",
                                {
                                    "$dateFromString": {
                                        "dateString": fromDate.toISOString()
                                    }
                                }
                            ]
                        },
                        {
                            "$lte": [
                                "$duration.end",
                                {
                                    "$dateFromString": {
                                        "dateString": toDate.toISOString()
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "tags",
                "foreignField": "email",
                "as": "user",
                "pipeline": [
                    {
                        "$project": {
                            "name": true,
                            "last_name": true,
                            "email": true,
                            "image": true
                        }
                    }
                ]
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$project": {
                "status": 1,
                "user": 1,
                "services": "$props.services",
                "professional": "$props.professional",
                "discount": "$props.discount"
            }
        }
    ]
}